import { Router, Response } from 'express';
import { FRD, FRDSelection, FRDSection, Template } from '../models';
import { authenticate } from '../middleware/auth';
import { RLSRequest } from '../middleware/rls';

const router = Router();

router.use(authenticate);

/**
 * GET /api/v1/frds/:id/wizard
 * Returns full wizard data (FRD metadata, selections, and active template sections) under RLS
 */
router.get('/:id/wizard', async (req: RLSRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await req.withRLS!(async (transaction) => {
      const whereClause: any = { id };
      if (req.user?.role !== 'admin') {
        whereClause.client_id = req.user?.clientId || '00000000-0000-0000-0000-000000000000';
      }

      const frd = await FRD.findOne({
        where: whereClause,
        include: [
          { model: Template, as: 'template' },
          { model: FRDSelection, as: 'selections' },
          { model: FRDSection, as: 'sections' },
        ],
        transaction,
      });

      return frd;
    });

    if (!result) {
      return res.status(404).json({ error: 'FRD document not found or access denied' });
    }

    return res.status(200).json({ wizard: result });
  } catch (error: any) {
    console.error('[Get Wizard Data Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/v1/frds/:id/selections
 * Debounced autosave endpoint for FRD selection tree
 */
router.put('/:id/selections', async (req: RLSRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { selection_tree } = req.body;

    if (!selection_tree || typeof selection_tree !== 'object') {
      return res.status(400).json({ error: 'selection_tree payload is required' });
    }

    const updatedSelection = await req.withRLS!(async (transaction) => {
      const whereClause: any = { id };
      if (req.user?.role !== 'admin') {
        whereClause.client_id = req.user?.clientId || '00000000-0000-0000-0000-000000000000';
      }

      const frd = await FRD.findOne({ where: whereClause, transaction });
      if (!frd) return null;

      const [selection] = await FRDSelection.findOrCreate({
        where: { frd_id: frd.id },
        defaults: { frd_id: frd.id, selection_tree: {} },
        transaction,
      });

      selection.selection_tree = { ...selection.selection_tree, ...selection_tree };
      await selection.save({ transaction });

      // Update FRD updated_at timestamp
      frd.changed('updated_at', true);
      await frd.save({ transaction });

      return selection;
    });

    if (!updatedSelection) {
      return res.status(404).json({ error: 'FRD document not found or access denied' });
    }

    return res.status(200).json({
      message: 'Selections autosaved successfully',
      selection: updatedSelection,
    });
  } catch (error: any) {
    console.error('[Autosave Selections Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
