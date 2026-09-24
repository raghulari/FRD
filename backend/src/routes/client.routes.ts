import { Router, Response } from 'express';
import { Client, User } from '../models';
import { authenticate } from '../middleware/auth';
import { hashPassword, comparePassword } from '../utils/password';
import { RLSRequest } from '../middleware/rls';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const updateProfileSchema = z.object({
  company_name: z.string().min(2, 'Company name is required'),
  company_details: z.record(z.any()).optional(),
});

const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string().min(8, 'New password must be at least 8 characters'),
});

/**
 * PUT /api/v1/client/profile
 * Update client company profile
 */
router.put('/profile', async (req: RLSRequest, res: Response) => {
  try {
    if (req.user?.role !== 'client' || !req.user.clientId) {
      return res.status(403).json({ error: 'Client profile only editable by client role' });
    }

    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: 'Validation Error', details: parseResult.error.flatten() });
    }

    const { company_name, company_details } = parseResult.data;

    const updatedClient = await req.withRLS!(async (transaction) => {
      const client = await Client.findByPk(req.user!.clientId, { transaction });
      if (!client) return null;

      client.company_name = company_name;
      if (company_details) {
        client.company_details = { ...client.company_details, ...company_details };
      }
      await client.save({ transaction });
      return client;
    });

    if (!updatedClient) {
      return res.status(404).json({ error: 'Client profile not found' });
    }

    return res.status(200).json({
      message: 'Profile updated successfully',
      client: updatedClient,
    });
  } catch (error: any) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/v1/client/password
 * Change account password
 */
router.put('/password', async (req: RLSRequest, res: Response) => {
  try {
    const parseResult = changePasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res
        .status(400)
        .json({ error: 'Validation Error', details: parseResult.error.flatten() });
    }

    const { old_password, new_password } = parseResult.data;

    const user = await User.findByPk(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await comparePassword(old_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password incorrect' });
    }

    user.password_hash = await hashPassword(new_password);
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('[Change Password Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
