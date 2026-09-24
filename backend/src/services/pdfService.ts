import PDFDocument from 'pdfkit';
import { Response } from 'express';

export function generateFRDPdf(frd: any, res: Response) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `FRD_${frd.id}_Specification.pdf`,
      Author: 'NUTZ Technovation Private Limited',
      Subject: 'Functional Requirement Document & Commercial Proposal',
    },
  });

  // Set HTTP Headers for PDF Streaming
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="FRD_Specification_${frd.id.slice(0, 8)}.pdf"`
  );

  doc.pipe(res);

  const selectionTree = frd.selections?.selection_tree || {};
  const companyDetails = selectionTree.step_1_company_details || {};
  const catalogTree = selectionTree.step_4_catalog_tree || {};
  const _techStack = selectionTree.step_5_tech_stack || {};
  const pricingData = selectionTree.step_10_payments_duration || {};
  const archData = selectionTree.step_8_architecture || {};
  const phasesData = selectionTree.step_9_implementation_phases || {};

  // Colors
  const COBALT = '#1E40AF';
  const DEEP_INK = '#0F172A';
  const TEXT_MUTED = '#475569';
  const BORDER_COLOR = '#CBD5E1';

  // -------------------------------------------------------------
  // HEADER
  // -------------------------------------------------------------
  doc.rect(40, 40, 515, 65).fill('#F8F9FA').stroke(BORDER_COLOR);

  doc
    .fillColor(COBALT)
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('NUTZ FRD GENERATOR PLATFORM', 55, 52);

  doc
    .fillColor(DEEP_INK)
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Functional Requirement Document (FRD) Specification', 55, 75);

  doc
    .fillColor(TEXT_MUTED)
    .fontSize(8)
    .font('Helvetica')
    .text(`Ref ID: NUTZ-FRD-${frd.id.slice(0, 8).toUpperCase()}`, 380, 52, { align: 'right' })
    .text(`Date: ${new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })}`, 380, 65, {
      align: 'right',
    })
    .text(`Status: OFFICIAL SPECIFICATION`, 380, 78, { align: 'right' });

  doc.moveDown(3);

  // -------------------------------------------------------------
  // SECTION 1: COMPANY PROFILE
  // -------------------------------------------------------------
  doc
    .fillColor(COBALT)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('1. Client & Organization Profile');
  doc.moveDown(0.5);

  doc.rect(40, doc.y, 515, 65).fill('#FFFFFF').stroke(BORDER_COLOR);

  const startY1 = doc.y + 10;
  doc
    .fillColor(DEEP_INK)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text(`Company Name: `, 55, startY1)
    .font('Helvetica')
    .text(`${companyDetails.company_name || 'N/A'}`)
    .font('Helvetica-Bold')
    .text(`Primary Contact: `, 55, startY1 + 18)
    .font('Helvetica')
    .text(`${companyDetails.client_name || 'N/A'}`)
    .font('Helvetica-Bold')
    .text(`Client Email: `, 300, startY1)
    .font('Helvetica')
    .text(`${companyDetails.client_email || 'N/A'}`)
    .font('Helvetica-Bold')
    .text(`Mobile Phone: `, 300, startY1 + 18)
    .font('Helvetica')
    .text(`${companyDetails.client_phone || 'N/A'}`);

  doc.y = startY1 + 65;
  doc.moveDown(1.5);

  // -------------------------------------------------------------
  // SECTION 2: PRODUCT CATALOG SCOPE
  // -------------------------------------------------------------
  doc
    .fillColor(COBALT)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('2. Product Catalog & Module Scope');
  doc.moveDown(0.5);

  doc
    .fillColor(DEEP_INK)
    .fontSize(9)
    .font('Helvetica-Bold')
    .text(`Product Category: `, 40)
    .font('Helvetica')
    .text(`${catalogTree.category?.name || 'Enterprise Multi-Tenant SaaS'}`);

  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').text('Selected Main Modules & Options:');
  doc.moveDown(0.3);

  const selectedOptionsMap = catalogTree.selected_options || {};
  const optionEntries = Object.entries(selectedOptionsMap);

  if (optionEntries.length === 0) {
    doc
      .font('Helvetica')
      .fillColor(TEXT_MUTED)
      .fontSize(8)
      .text('• Standard Core Authentication, User Management, and Client Dashboard.');
  } else {
    optionEntries.forEach(([subId, options]: [string, any]) => {
      if (Array.isArray(options) && options.length > 0) {
        doc
          .font('Helvetica')
          .fillColor(DEEP_INK)
          .fontSize(8)
          .text(`• Sub-Module ${subId.slice(0, 8)}: ${options.join(', ')}`);
      }
    });
  }

  doc.moveDown(1.5);

  // -------------------------------------------------------------
  // SECTION 3: SYSTEM ARCHITECTURE & IMPLEMENTATION PHASES
  // -------------------------------------------------------------
  doc
    .fillColor(COBALT)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('3. Architecture & Implementation Roadmap');
  doc.moveDown(0.5);

  doc
    .fillColor(DEEP_INK)
    .fontSize(8.5)
    .font('Helvetica')
    .text(
      archData.overview_text ||
        'Architecture is structured around a high-throughput, multi-tenant cloud-native blueprint. Request traffic enters through an Nginx Ingress Reverse Proxy performing SSL/TLS termination, routing requests to Node.js Express controllers with PostgreSQL Row-Level Security (RLS) enforcement.'
    );

  doc.moveDown(1);
  doc.fillColor(COBALT).fontSize(10).font('Helvetica-Bold').text('5-Phase Delivery Schedule:');
  doc.moveDown(0.3);

  const phases = phasesData.phases || [
    { phase_name: 'Phase 1: Architecture Planning & Design Blueprint', duration_weeks: 2 },
    { phase_name: 'Phase 2: Core Platform & Database Foundation', duration_weeks: 2 },
    { phase_name: 'Phase 3: Module & Custom Feature Implementation', duration_weeks: 3 },
    { phase_name: 'Phase 4: QA, Security Audit & Performance Testing', duration_weeks: 2 },
    { phase_name: 'Phase 5: Production Deployment & Handover', duration_weeks: 1 },
  ];

  phases.forEach((p: any, idx: number) => {
    doc
      .fillColor(DEEP_INK)
      .fontSize(8)
      .font('Helvetica-Bold')
      .text(`${p.phase_name || `Phase ${idx + 1}`}: `)
      .font('Helvetica')
      .text(`${p.duration_weeks || 2} Weeks`);
  });

  doc.moveDown(1.5);

  // -------------------------------------------------------------
  // SECTION 4: COMMERCIAL INVESTMENT & MILESTONES
  // -------------------------------------------------------------
  doc
    .fillColor(COBALT)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('4. Commercial Terms & Investment Breakdown');
  doc.moveDown(0.5);

  const subtotal = pricingData.subtotal_cost || 250000;
  const gst = pricingData.gst_amount || 45000;
  const grandTotal = pricingData.grand_total_cost || 295000;
  const milestones = pricingData.milestones || [
    {
      percentage: 40,
      phase: 'Milestone 1: Advance Commitment on Project Kickoff',
      amount: Math.round(grandTotal * 0.4),
    },
    {
      percentage: 30,
      phase: 'Milestone 2: Beta Version Release & QA Approval',
      amount: Math.round(grandTotal * 0.3),
    },
    {
      percentage: 30,
      phase: 'Milestone 3: Final Production Deployment & Sign-off',
      amount: Math.round(grandTotal * 0.3),
    },
  ];

  doc
    .fillColor(DEEP_INK)
    .fontSize(9)
    .font('Helvetica')
    .text(`Base System Commercial Subtotal: ₹${subtotal.toLocaleString('en-IN')}`)
    .text(`GST Tax (18%): ₹${gst.toLocaleString('en-IN')}`)
    .font('Helvetica-Bold')
    .fillColor(COBALT)
    .text(`Grand Total Project Investment: ₹${grandTotal.toLocaleString('en-IN')}`);

  doc.moveDown(0.5);
  doc.fillColor(DEEP_INK).fontSize(9).font('Helvetica-Bold').text('Milestone Payment Schedule:');
  doc.moveDown(0.3);

  milestones.forEach((m: any) => {
    doc
      .fillColor(DEEP_INK)
      .fontSize(8)
      .font('Helvetica')
      .text(`• [${m.percentage}%] ${m.phase}: ₹${(m.amount || 0).toLocaleString('en-IN')}`);
  });

  doc.moveDown(2);

  // -------------------------------------------------------------
  // FOOTER & SIGN-OFF
  // -------------------------------------------------------------
  doc.strokeColor(BORDER_COLOR).moveTo(40, doc.y).lineTo(555, doc.y).stroke();

  doc.moveDown(1);
  doc
    .fillColor(TEXT_MUTED)
    .fontSize(7)
    .font('Helvetica')
    .text(
      'CONFIDENTIALITY NOTICE: This document contains proprietary functional specifications prepared by NUTZ Technovation Private Limited. All rights reserved.',
      { align: 'center' }
    );

  doc.end();
}
