/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { Certificate, LabObservationRow } from '../types/lms';

/**
 * Generates and downloads a formatted PDF of lesson study notes.
 */
export function downloadLessonNotesPDF(params: {
  courseTitle: string;
  lessonTitle: string;
  instructorName: string;
  notesTitle: string;
  content: string;
}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;

  // Header band
  doc.setFillColor(8, 13, 26);
  doc.rect(0, 0, pageWidth, 88, 'F');

  doc.setTextColor(240, 68, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TRINETRA VIRTUAL LEARNING PLATFORM', margin, 32);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.text(params.notesTitle || params.lessonTitle, margin, 56);

  doc.setTextColor(167, 176, 192);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Course: ${params.courseTitle}   |   Instructor: ${params.instructorName}`, margin, 74);

  // Body content
  let y = 120;
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);

  const lines = params.content.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      y += 8;
      continue;
    }

    if (y > 760) {
      doc.addPage();
      y = 54;
    }

    if (line.startsWith('## ')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      const wrapped = doc.splitTextToSize(line.replace('## ', ''), maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 16 + 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
    } else if (line.startsWith('# ')) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      const wrapped = doc.splitTextToSize(line.replace('# ', ''), maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 18 + 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
    } else {
      const cleaned = line.replace(/\*\*/g, '').replace(/`/g, '');
      const wrapped = doc.splitTextToSize(cleaned, maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14 + 4;
    }
  }

  // Footer
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TRINETRA STEM Education — Experience Learning Beyond Boundaries.', margin, 815);

  const safeName = params.lessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  doc.save(`trinetra_notes_${safeName}.pdf`);
}

/**
 * Generates and downloads an official landscape Certificate PDF.
 */
export function downloadCertificatePDF(cert: Certificate) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Deep navy background
  doc.setFillColor(8, 13, 26);
  doc.rect(0, 0, w, h, 'F');

  // Double decorative border
  doc.setDrawColor(75, 139, 255);
  doc.setLineWidth(3);
  doc.rect(28, 28, w - 56, h - 56);

  doc.setDrawColor(240, 68, 50);
  doc.setLineWidth(1.2);
  doc.rect(38, 38, w - 76, h - 76);

  // Header brand
  doc.setTextColor(240, 68, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('TRINETRA', w / 2, 85, { align: 'center' });

  doc.setTextColor(167, 176, 192);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('EXPERIENCE LEARNING BEYOND BOUNDARIES', w / 2, 105, { align: 'center' });

  // Certificate Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.text('CERTIFICATE OF COMPLETION', w / 2, 165, { align: 'center' });

  doc.setTextColor(167, 176, 192);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('This is to proudly certify that', w / 2, 210, { align: 'center' });

  // Student Name
  doc.setTextColor(75, 139, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(cert.studentName, w / 2, 258, { align: 'center' });

  // Completion Statement
  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.text(
    'has successfully completed all required modules, practical simulations, and the final assessment for',
    w / 2,
    305,
    { align: 'center' }
  );

  // Course Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  const wrappedTitle = doc.splitTextToSize(cert.courseTitle, w - 180);
  doc.text(wrappedTitle, w / 2, 342, { align: 'center' });

  // Signature & Metadata Row
  const sigY = 455;
  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(1);
  doc.line(100, sigY, 290, sigY);
  doc.line(w - 290, sigY, w - 100, sigY);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(cert.instructorName, 195, sigY + 18, { align: 'center' });
  doc.text(new Date(cert.issuedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), w - 195, sigY + 18, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Course Instructor', 195, sigY + 33, { align: 'center' });
  doc.text('Date of Completion', w - 195, sigY + 33, { align: 'center' });

  // Certificate Verification Code
  doc.setTextColor(75, 139, 255);
  doc.setFont('courier', 'bold');
  doc.setFontSize(10.5);
  doc.text(`VERIFICATION ID: ${cert.certificateCode}`, w / 2, 528, { align: 'center' });

  doc.save(`trinetra_certificate_${cert.certificateCode}.pdf`);
}

/**
 * Generates and downloads a formatted Virtual Lab Experiment Report PDF.
 */
export function downloadExperimentReportPDF(params: {
  title: string;
  category: string;
  objective: string;
  theory: string;
  components: string[];
  parameters: Record<string, string | number>;
  observations: LabObservationRow[];
  conclusion: string;
}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const margin = 44;
  const maxWidth = w - margin * 2;

  doc.setFillColor(8, 13, 26);
  doc.rect(0, 0, w, 82, 'F');

  doc.setTextColor(240, 68, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`TRINETRA VIRTUAL LABORATORY  |  ${params.category.toUpperCase()}`, margin, 28);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(params.title, margin, 52);

  doc.setTextColor(167, 176, 192);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Note: Computer-Simulated Mathematical Model (Not a physical hardware lab log)', margin, 70);

  let y = 110;
  const addSection = (heading: string, body: string) => {
    if (y > 740) {
      doc.addPage();
      y = 50;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(heading, margin, y);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const wrapped = doc.splitTextToSize(body, maxWidth);
    doc.text(wrapped, margin, y);
    y += wrapped.length * 13 + 12;
  };

  addSection('1. Objective', params.objective);
  addSection('2. Theoretical Background', params.theory);
  addSection('3. Virtual Apparatus & Components', params.components.join(', '));

  const paramLines = Object.entries(params.parameters)
    .map(([k, v]) => `${k}: ${v}`)
    .join('   |   ');
  addSection('4. Active Experiment Configuration', paramLines);

  // Observation Table
  if (y > 680) {
    doc.addPage();
    y = 50;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('5. Recorded Observation Table', margin, y);
  y += 16;

  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  if (params.observations.length === 0) {
    doc.text('No observation trials recorded during this session.', margin, y);
    y += 18;
  } else {
    params.observations.slice(0, 15).forEach((row) => {
      if (y > 770) {
        doc.addPage();
        y = 50;
      }
      const inStr = Object.entries(row.inputs).map(([k, v]) => `${k}=${v}`).join(', ');
      const outStr = Object.entries(row.outputs).map(([k, v]) => `${k}=${v}`).join(', ');
      const line = `Trial #${row.trial}: [${inStr}] -> [${outStr}]`;
      const wrapped = doc.splitTextToSize(line, maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 12 + 4;
    });
  }

  y += 10;
  addSection('6. Conclusion & Verification', params.conclusion);

  const safeTitle = params.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  doc.save(`trinetra_lab_report_${safeTitle}.pdf`);
}
