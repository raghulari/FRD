import { Router, Response } from 'express';
import { FRD, FRDSelection, FRDSection, Template } from '../models';
import { authenticate } from '../middleware/auth';
import { RLSRequest } from '../middleware/rls';
import { generateFRDPdf } from '../services/pdfService';

const router = Router();

router.use(authenticate);

/**
 * GET /api/v1/frds
 * List all FRDs accessible to the current tenant (RLS-enforced)
 */
router.get('/', async (req: RLSRequest, res: Response) => {
  try {
    const frds = await req.withRLS!(async (transaction) => {
      const whereClause: any = {};
      if (req.user?.role !== 'admin') {
        whereClause.client_id = req.user?.clientId || '00000000-0000-0000-0000-000000000000';
      }

      return await FRD.findAll({
        where: whereClause,
        include: [
          { model: Template, as: 'template', attributes: ['id', 'version'] },
          { model: FRDSelection, as: 'selections', attributes: ['id', 'updated_at'] },
        ],
        order: [['updated_at', 'DESC']],
        transaction,
      });
    });

    return res.status(200).json({ frds });
  } catch (error: any) {
    console.error('[Get FRDs Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/v1/frds
 * Create a new draft FRD for current client
 */
router.post('/', async (req: RLSRequest, res: Response) => {
  try {
    if (req.user?.role !== 'client' || !req.user.clientId) {
      return res.status(403).json({ error: 'Only client accounts can create draft FRDs' });
    }

    const activeTemplate = await Template.findOne({
      where: { is_active: true },
      order: [['version', 'DESC']],
    });

    if (!activeTemplate) {
      return res.status(500).json({ error: 'No active FRD template found' });
    }

    const newFrd = await req.withRLS!(async (transaction) => {
      const frd = await FRD.create(
        {
          client_id: req.user!.clientId!,
          template_version_id: activeTemplate.id,
          status: 'draft',
          filename: `FRD_${req.body.company_name || 'Draft'}_${Date.now()}.pdf`,
        },
        { transaction }
      );

      // Create empty selection tree
      await FRDSelection.create(
        {
          frd_id: frd.id,
          selection_tree: {
            step_1_company_details: {
              company_name: req.body.company_name || '',
            },
          },
        },
        { transaction }
      );

      // Initialize FRD sections from active template
      const templateSections = activeTemplate.sections || {};
      const sectionKeys = [
        'requirements',
        'deliverables',
        'communication',
        'additional_pricing',
        'excluded',
        'other_agreements',
      ];

      for (const key of sectionKeys) {
        if (templateSections[key]) {
          await FRDSection.create(
            {
              frd_id: frd.id,
              section_key: key,
              content: templateSections[key],
              is_admin_editable: true,
            },
            { transaction }
          );
        }
      }

      return frd;
    });

    return res.status(201).json({
      message: 'Draft FRD created successfully',
      frd: newFrd,
    });
  } catch (error: any) {
    console.error('[Create FRD Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/frds/:id
 * Get single FRD (RLS enforced - returns 404 if attempting to access another client's FRD)
 */
router.get('/:id', async (req: RLSRequest, res: Response) => {
  try {
    const { id } = req.params;

    const frd = await req.withRLS!(async (transaction) => {
      const whereClause: any = { id };
      if (req.user?.role !== 'admin') {
        whereClause.client_id = req.user?.clientId || '00000000-0000-0000-0000-000000000000';
      }

      return await FRD.findOne({
        where: whereClause,
        include: [
          { model: Template, as: 'template' },
          { model: FRDSelection, as: 'selections' },
          { model: FRDSection, as: 'sections' },
        ],
        transaction,
      });
    });

    if (!frd) {
      return res.status(404).json({ error: 'FRD document not found or access denied' });
    }

    return res.status(200).json({ frd });
  } catch (error: any) {
    console.error('[Get FRD By ID Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/v1/frds/:id
 * Delete a draft FRD (RLS enforced)
 */
router.delete('/:id', async (req: RLSRequest, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await req.withRLS!(async (transaction) => {
      const whereClause: any = { id };
      if (req.user?.role !== 'admin') {
        whereClause.client_id = req.user?.clientId || '00000000-0000-0000-0000-000000000000';
      }

      const frd = await FRD.findOne({ where: whereClause, transaction });
      if (!frd) return false;
      await frd.destroy({ transaction });
      return true;
    });

    if (!deleted) {
      return res.status(404).json({ error: 'FRD document not found or access denied' });
    }

    return res.status(200).json({ message: 'FRD draft deleted successfully' });
  } catch (error: any) {
    console.error('[Delete FRD Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/frds/:id/export-pdf
 * Export server-side PDF specification document (RLS-enforced)
 */
router.get('/:id/export-pdf', async (req: RLSRequest, res: Response) => {
  try {
    const { id } = req.params;

    const frd = await req.withRLS!(async (transaction) => {
      const whereClause: any = { id };
      if (req.user?.role !== 'admin') {
        whereClause.client_id = req.user?.clientId || '00000000-0000-0000-0000-000000000000';
      }

      return await FRD.findOne({
        where: whereClause,
        include: [
          { model: Template, as: 'template' },
          { model: FRDSelection, as: 'selections' },
          { model: FRDSection, as: 'sections' },
        ],
        transaction,
      });
    });

    if (!frd) {
      return res.status(404).json({ error: 'FRD document not found or access denied' });
    }

    generateFRDPdf(frd, res);
  } catch (error: any) {
    console.error('[Export PDF Error]:', error);
    return res.status(500).json({ error: 'Failed to generate PDF export' });
  }
});

export default router;
