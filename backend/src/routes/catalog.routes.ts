import { Router, Response } from 'express';
import { ProductCategory, ProductType, MainModule, SubModule, ModuleOption } from '../models';
import { authenticate } from '../middleware/auth';
import { RLSRequest } from '../middleware/rls';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

/**
 * GET /api/v1/catalog/categories
 * Fetch all product categories
 */
router.get('/categories', async (_req: RLSRequest, res: Response) => {
  try {
    const categories = await ProductCategory.findAll({
      order: [['name', 'ASC']],
    });
    return res.status(200).json({ categories });
  } catch (error: any) {
    console.error('[Catalog Categories Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/catalog/categories/:id/types
 * Fetch product types for a category
 */
router.get('/categories/:id/types', async (req: RLSRequest, res: Response) => {
  try {
    const { id } = req.params;
    const types = await ProductType.findAll({
      where: { category_id: id },
      order: [['name', 'ASC']],
    });
    return res.status(200).json({ types });
  } catch (error: any) {
    console.error('[Catalog Types Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/catalog/types/:id/modules
 * Fetch main modules for a product type
 */
router.get('/types/:id/modules', async (req: RLSRequest, res: Response) => {
  try {
    const { id } = req.params;
    const mainModules = await MainModule.findAll({
      where: { product_type_id: id },
      order: [['name', 'ASC']],
    });
    return res.status(200).json({ mainModules });
  } catch (error: any) {
    console.error('[Catalog Modules Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/v1/catalog/modules/:id/submodules
 * Fetch sub-modules and options for a main module
 */
router.get('/modules/:id/submodules', async (req: RLSRequest, res: Response) => {
  try {
    const { id } = req.params;
    const subModules = await SubModule.findAll({
      where: { main_module_id: id },
      include: [{ model: ModuleOption, as: 'options', order: [['name', 'ASC']] }],
      order: [['name', 'ASC']],
    });
    return res.status(200).json({ subModules });
  } catch (error: any) {
    console.error('[Catalog SubModules Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const customOptionSchema = z.object({
  sub_module_id: z.string().uuid(),
  custom_option_name: z.string().min(2, 'Option name is required'),
});

/**
 * POST /api/v1/catalog/custom
 * Add custom sub-module / option by client inline (flagged is_custom: true)
 */
router.post('/custom', async (req: RLSRequest, res: Response) => {
  try {
    const parseResult = customOptionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: 'Validation Error', details: parseResult.error.flatten() });
    }

    const { sub_module_id, custom_option_name } = parseResult.data;

    const subModule = await SubModule.findByPk(sub_module_id);
    if (!subModule) {
      return res.status(404).json({ error: 'Sub-module not found' });
    }

    const newOption = await ModuleOption.create({
      sub_module_id,
      name: custom_option_name,
      is_custom: true,
    });

    return res.status(201).json({
      message: 'Custom feature option added successfully',
      option: newOption,
    });
  } catch (error: any) {
    console.error('[Custom Option Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
