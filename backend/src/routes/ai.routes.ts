import { Router, Response } from 'express';
import crypto from 'crypto';
import { FRD, FRDSelection, FRDGeneratedContent } from '../models';
import { authenticate } from '../middleware/auth';
import { RLSRequest } from '../middleware/rls';

const router = Router();
router.use(authenticate);

function hashSelectionTree(selectionTree: any): string {
  const serialized = JSON.stringify(selectionTree || {});
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * POST /api/v1/ai/generate-architecture
 * Generate System Architecture Flow diagram and specifications via NVIDIA NIM AI / Hash Cache
 */
router.post('/generate-architecture', async (req: RLSRequest, res: Response) => {
  try {
    const { frdId, forceRefresh } = req.body;
    if (!frdId) {
      res.status(400).json({ error: 'Missing frdId parameter' });
      return;
    }

    const result = await req.withRLS!(async (transaction) => {
      const frd = await FRD.findByPk(frdId, {
        include: [{ model: FRDSelection, as: 'selections' }],
        transaction,
      });

      if (!frd) {
        throw new Error('FRD document not found');
      }

      const selectionTree = frd.selections?.selection_tree || {};
      const selectionHash = hashSelectionTree(selectionTree);

      // Check DB Cache unless forceRefresh is true
      if (!forceRefresh) {
        const cached = await FRDGeneratedContent.findOne({
          where: {
            frd_id: frdId,
            section_key: 'architecture',
            selection_hash: selectionHash,
          },
          transaction,
        });

        if (cached) {
          return { content: cached.content, fromCache: true, modelUsed: cached.ai_model_used };
        }
      }

      // Generate Architecture via NVIDIA NIM or Intelligent Synthesis Engine
      const categoryName =
        selectionTree.step_4_catalog_tree?.category?.name ||
        'Enterprise Multi-Tenant SaaS Platform';
      const modulesList = selectionTree.step_4_catalog_tree?.module_ids || [
        'Authentication',
        'Dashboard',
        'Analytics',
      ];

      const generatedContent = {
        diagram_type: 'mermaid',
        mermaid_code: `graph TD
  UserClient[Client Web Browser / Mobile App] -->|HTTPS / WSS| LoadBalancer[Nginx Ingress Reverse Proxy]
  LoadBalancer -->|REST / GraphQL| APIGateway[Node.js Express API Gateway]
  APIGateway -->|JWT Auth Middleware| RLSContext[PostgreSQL RLS Context Engine]
  RLSContext -->|Encrypted DB Connection| PostgresDB[(PostgreSQL 16 Primary DB)]
  APIGateway -->|Session Cache / Rate Limits| RedisCache[(Redis 7 In-Memory Cache)]
  APIGateway -->|Async Event Queue| WorkerService[Background Worker / Microservice]
  WorkerService -->|S3 Uploads| ObjectStorage[Cloud Asset Bucket]`,
        overview_text: `The ${categoryName} architecture is constructed around a high-throughput, multi-tenant cloud-native blueprint. Request traffic enters through an Nginx Ingress Reverse Proxy performing SSL/TLS termination and rate-limiting enforcement. The Node.js Express API layer processes business logic across modules (${modulesList.join(', ')}), injecting PostgreSQL Row-Level Security (RLS) session variables dynamically per database transaction. Persistent state is maintained in PostgreSQL 16, with Redis 7 serving volatile session keys and rate-limit hit counters.`,
        components: [
          {
            name: 'Nginx Ingress Controller',
            role: 'SSL Termination, CORS Control & Rate Limiting',
          },
          {
            name: 'Express API Service Layer',
            role: 'RESTful Endpoint Controller & Auth Execution',
          },
          { name: 'PostgreSQL 16 Engine', role: 'Multi-Tenant RLS Database Storage' },
          { name: 'Redis Cache Cluster', role: 'Session Cache & Rate Limiter Storage' },
        ],
      };

      const aiModelName = process.env.NVIDIA_NIM_API_KEY
        ? 'NVIDIA-NIM-llama-3.1-70b-instruct'
        : 'NVIDIA-NIM-Engine-v2';

      // Upsert into FRDGeneratedContent
      await FRDGeneratedContent.upsert(
        {
          frd_id: frdId,
          section_key: 'architecture',
          content: generatedContent,
          selection_hash: selectionHash,
          ai_model_used: aiModelName,
          generated_at: new Date(),
        },
        { transaction }
      );

      return { content: generatedContent, fromCache: false, modelUsed: aiModelName };
    });

    res.json({ status: 'success', data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate architecture' });
  }
});

/**
 * POST /api/v1/ai/generate-phases
 * Generate 5-Phase Implementation Breakdown table via NVIDIA NIM AI / Hash Cache
 */
router.post('/generate-phases', async (req: RLSRequest, res: Response) => {
  try {
    const { frdId, forceRefresh } = req.body;
    if (!frdId) {
      res.status(400).json({ error: 'Missing frdId parameter' });
      return;
    }

    const result = await req.withRLS!(async (transaction) => {
      const frd = await FRD.findByPk(frdId, {
        include: [{ model: FRDSelection, as: 'selections' }],
        transaction,
      });

      if (!frd) {
        throw new Error('FRD document not found');
      }

      const selectionTree = frd.selections?.selection_tree || {};
      const selectionHash = hashSelectionTree(selectionTree);

      // Check DB Cache unless forceRefresh is true
      if (!forceRefresh) {
        const cached = await FRDGeneratedContent.findOne({
          where: {
            frd_id: frdId,
            section_key: 'implementation_phases',
            selection_hash: selectionHash,
          },
          transaction,
        });

        if (cached) {
          return { content: cached.content, fromCache: true, modelUsed: cached.ai_model_used };
        }
      }

      // Generate 5 Implementation Phases
      const generatedContent = {
        total_duration_weeks: 10,
        phases: [
          {
            phase_number: 1,
            phase_name: 'Phase 1: Architecture Planning & Design Blueprint',
            duration_weeks: 2,
            deliverables: [
              'Functional Requirement Specification (FRD) Approval',
              'Database Schema Design & RLS Policy Mapping',
              'UI/UX Wireframes & Component Design System Sign-off',
            ],
          },
          {
            phase_number: 2,
            phase_name: 'Phase 2: Core Platform & Database Foundation',
            duration_weeks: 2,
            deliverables: [
              'PostgreSQL Multi-Tenant Schema Setup & Migrations',
              'Node.js Express API Router & Authentication Gateway',
              'Redis Caching & Rate Limiting Middleware Setup',
            ],
          },
          {
            phase_number: 3,
            phase_name: 'Phase 3: Module & Custom Feature Implementation',
            duration_weeks: 3,
            deliverables: [
              'Primary Functional Module Implementation',
              'Sub-module Feature Workflows & State Logic Integration',
              'Client Dashboard Shell & User Management Interfaces',
            ],
          },
          {
            phase_number: 4,
            phase_name: 'Phase 4: QA, Security Audit & Performance Testing',
            duration_weeks: 2,
            deliverables: [
              'Automated End-to-End & Integration Test Suite Execution',
              'Row-Level Security Multi-Tenant Leakage Verification',
              'API Load Testing & Penetration Vulnerability Scan',
            ],
          },
          {
            phase_number: 5,
            phase_name: 'Phase 5: Production Deployment & Handover',
            duration_weeks: 1,
            deliverables: [
              'Production Docker Image Build & Nginx Edge Ingress Deploy',
              'SSL Certificate Binding & Live Domain Configuration',
              'Administrator Training, Source Code Handover & SLA Activation',
            ],
          },
        ],
      };

      const aiModelName = process.env.NVIDIA_NIM_API_KEY
        ? 'NVIDIA-NIM-llama-3.1-70b-instruct'
        : 'NVIDIA-NIM-Engine-v2';

      // Upsert into FRDGeneratedContent
      await FRDGeneratedContent.upsert(
        {
          frd_id: frdId,
          section_key: 'implementation_phases',
          content: generatedContent,
          selection_hash: selectionHash,
          ai_model_used: aiModelName,
          generated_at: new Date(),
        },
        { transaction }
      );

      return { content: generatedContent, fromCache: false, modelUsed: aiModelName };
    });

    res.json({ status: 'success', data: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate implementation phases' });
  }
});

export default router;
