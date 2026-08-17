import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { PatientInfo, CephAnalysisResult, CephMeasurement } from "@/types";

export async function generateCephPdfReport({
  patient,
  analysisData,
  activeMalocclusion,
  confirmedFindings,
  customNotes,
  cephContainerElement,
  onProgress,
}: {
  patient: PatientInfo;
  analysisData: CephAnalysisResult;
  activeMalocclusion: string;
  confirmedFindings: {
    skeletal: string;
    dental: string;
    isConfirmed: boolean;
  };
  customNotes: string;
  cephContainerElement?: HTMLElement | null;
  onProgress?: (status: string) => void;
}): Promise<void> {
  try {
    if (onProgress) onProgress("Preparing report document...");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    let currentY = margin;

    // Helper: Draw header on pages
    const drawHeader = (pageNumber: number, totalPages: number = 2) => {
      // Header bar
      pdf.setFillColor(7, 11, 18); // #070b12
      pdf.rect(0, 0, pageWidth, 24, "F");

      // Brand text
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text("Ceph", margin, 14);

      pdf.setTextColor(56, 189, 248); // #38bdf8 cyan
      pdf.text("Vision", margin + 13, 14);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text("AI-ASSISTED CEPHALOMETRIC CLINICAL REPORT", margin, 19);

      // Date and page count right aligned
      pdf.text(
        `Date: ${patient.date || new Date().toLocaleDateString()}  |  Page ${pageNumber} of ${totalPages}`,
        pageWidth - margin,
        15,
        { align: "right" }
      );

      // Cyan accent line
      pdf.setDrawColor(56, 189, 248);
      pdf.setLineWidth(0.8);
      pdf.line(margin, 24, pageWidth - margin, 24);
    };

    // PAGE 1
    drawHeader(1, 2);
    currentY = 32;

    // Patient Info Card
    pdf.setFillColor(248, 250, 252); // slate-50
    pdf.setDrawColor(226, 232, 240); // slate-200
    pdf.roundedRect(margin, currentY, contentWidth, 22, 2, 2, "FD");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(30, 41, 59); // slate-800
    pdf.text("PATIENT DEMOGRAPHICS & STUDY DETAILS", margin + 4, currentY + 6);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(71, 85, 105);

    const col1X = margin + 4;
    const col2X = margin + 50;
    const col3X = margin + 95;
    const col4X = margin + 140;

    pdf.text(`Name: `, col1X, currentY + 14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text(patient.name || "Anonymous Patient", col1X + 11, currentY + 14);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(71, 85, 105);
    pdf.text(`ID: `, col2X, currentY + 14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text(patient.id || "PT-001", col2X + 6, currentY + 14);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Age: `, col3X, currentY + 14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text(patient.age ? `${patient.age} yrs` : "—", col3X + 8, currentY + 14);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Sex: `, col4X, currentY + 14);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text(patient.sex || "—", col4X + 8, currentY + 14);

    currentY += 28;

    // Cephalogram Image Capture (if container exists)
    let cephImageAdded = false;
    if (cephContainerElement) {
      if (onProgress) onProgress("Rendering cephalometric tracing...");
      try {
        const canvas = await html2canvas(cephContainerElement, {
          backgroundColor: "#000000",
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const imgWidth = 65;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.setFillColor(15, 23, 42);
        pdf.roundedRect(margin, currentY, imgWidth, imgHeight, 2, 2, "F");
        pdf.addImage(imgData, "JPEG", margin, currentY, imgWidth, imgHeight);

        // Border around image
        pdf.setDrawColor(56, 189, 248);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(margin, currentY, imgWidth, imgHeight, 2, 2, "D");

        cephImageAdded = true;
      } catch (e) {
        console.warn("Could not capture ceph canvas image for PDF", e);
      }
    }

    // Cephalometric Measurements Table
    const tableX = cephImageAdded ? margin + 70 : margin;
    const tableWidth = cephImageAdded ? contentWidth - 70 : contentWidth;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text("CEPHALOMETRIC MEASUREMENTS", tableX, currentY + 4);

    // Table Header
    const rowHeight = 6.2;
    let tableY = currentY + 7;

    pdf.setFillColor(241, 245, 249); // slate-100
    pdf.rect(tableX, tableY, tableWidth, rowHeight, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);

    pdf.text("Parameter", tableX + 2, tableY + 4.2);
    pdf.text("Value", tableX + 22, tableY + 4.2);
    pdf.text("Norm Reference", tableX + 38, tableY + 4.2);
    pdf.text("Clinical Interpretation", tableX + 68, tableY + 4.2);

    tableY += rowHeight;

    const measurementsList = [
      { name: "SNA", data: analysisData.measurements.SNA },
      { name: "SNB", data: analysisData.measurements.SNB },
      { name: "ANB", data: analysisData.measurements.ANB },
      { name: "Wits", data: analysisData.measurements.Wits },
      { name: "FMA", data: analysisData.measurements.FMA },
      { name: "IMPA", data: analysisData.measurements.IMPA },
    ];

    measurementsList.forEach((m, idx) => {
      if (idx % 2 === 1) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(tableX, tableY, tableWidth, rowHeight, "F");
      }

      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.2);
      pdf.line(tableX, tableY + rowHeight, tableX + tableWidth, tableY + rowHeight);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(15, 23, 42);
      pdf.text(m.name, tableX + 2, tableY + 4.2);

      // Measurement Value
      const valStr = typeof m.data?.value === "number" ? `${m.data.value}°` : `${m.data?.value || "—"}`;
      pdf.setTextColor(2, 132, 199); // Sky blue
      pdf.text(valStr, tableX + 22, tableY + 4.2);

      // Reference Norm
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(m.data?.norm || "—", tableX + 38, tableY + 4.2);

      // Status / Interpretation
      pdf.setTextColor(51, 65, 85);
      const interpText = pdf.splitTextToSize(m.data?.interpretation || "—", tableWidth - 70);
      pdf.text(interpText[0] || "—", tableX + 68, tableY + 4.2);

      tableY += rowHeight;
    });

    // Advance currentY past image & table
    currentY = Math.max(cephImageAdded ? currentY + 68 : currentY + 50, tableY + 6);

    // Malocclusion Classification Box
    pdf.setFillColor(240, 253, 250); // Teal-50
    pdf.setDrawColor(45, 212, 191); // Teal-400
    pdf.roundedRect(margin, currentY, contentWidth, 18, 2, 2, "FD");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(15, 118, 110); // Teal-700
    pdf.text("MALOCCLUSION CLASSIFICATION", margin + 4, currentY + 5.5);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(13, 148, 136); // Teal-600
    const malocclusionText = activeMalocclusion || analysisData.malocclusion?.classification || "Class II Malocclusion";
    pdf.text(`${malocclusionText}  -  ${analysisData.malocclusion?.subtype || ""}`, margin + 4, currentY + 11.5);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);
    pdf.text(
      `Skeletal: ${analysisData.malocclusion?.skeletalPattern || "—"}   |   Dental: ${analysisData.malocclusion?.dentalPattern || "—"}`,
      margin + 4,
      currentY + 15.5
    );

    currentY += 23;

    // AI & Clinician Findings Box
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(margin, currentY, contentWidth, 48, 2, 2, "FD");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(15, 23, 42);
    pdf.text("CLINICAL & CEPHALOMETRIC FINDINGS", margin + 4, currentY + 6);

    if (confirmedFindings.isConfirmed) {
      pdf.setFillColor(16, 185, 129); // green
      pdf.roundedRect(pageWidth - margin - 42, currentY + 2.5, 38, 5, 1, 1, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6.5);
      pdf.setTextColor(255, 255, 255);
      pdf.text("CONFIRMED BY CLINICIAN", pageWidth - margin - 40, currentY + 6);
    }

    // Skeletal Findings
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(30, 41, 59);
    pdf.text("Skeletal Findings:", margin + 4, currentY + 13);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);
    const skeletalLines = pdf.splitTextToSize(confirmedFindings.skeletal || analysisData.aiFindings?.skeletal || "—", contentWidth - 8);
    pdf.text(skeletalLines.slice(0, 3), margin + 4, currentY + 17);

    // Dental Findings
    const dentalStartY = currentY + 28;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(30, 41, 59);
    pdf.text("Dental Findings:", margin + 4, dentalStartY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);
    const dentalLines = pdf.splitTextToSize(confirmedFindings.dental || analysisData.aiFindings?.dental || "—", contentWidth - 8);
    pdf.text(dentalLines.slice(0, 3), margin + 4, dentalStartY + 4);

    // PAGE 2: Treatment Objectives & Treatment Plans
    pdf.addPage();
    drawHeader(2, 2);
    currentY = 32;

    // Treatment Objectives Card
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, currentY, contentWidth, 46, 2, 2, "FD");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(15, 23, 42);
    pdf.text("TREATMENT OBJECTIVES (PATIENT-SPECIFIC)", margin + 4, currentY + 6);

    let objY = currentY + 12;
    const objectives = analysisData.treatmentObjectives || [];

    objectives.slice(0, 6).forEach((obj, idx) => {
      pdf.setFillColor(56, 189, 248);
      pdf.circle(margin + 6, objY - 1, 1.2, "F");

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(51, 65, 85);
      const textLines = pdf.splitTextToSize(obj, contentWidth - 14);
      pdf.text(textLines[0], margin + 10, objY);
      objY += 5.2;
    });

    currentY += 52;

    // Treatment Options (Braces & Aligners Side-by-Side)
    const cardWidth = (contentWidth - 6) / 2;

    // Left: Fixed Braces
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(margin, currentY, cardWidth, 80, 2, 2, "FD");

    pdf.setFillColor(14, 165, 233);
    pdf.rect(margin, currentY, cardWidth, 6, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("OPTION 1: FIXED APPLIANCE (BRACES)", margin + 4, currentY + 4.3);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`Duration: ${analysisData.treatmentPlans.braces.duration || "18-24 months"}`, margin + 4, currentY + 11);

    let bracePhaseY = currentY + 16;
    analysisData.treatmentPlans.braces.phases.slice(0, 4).forEach((phase) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(30, 41, 59);
      pdf.text(`${phase.stage}: ${phase.title}`, margin + 4, bracePhaseY);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      const pDesc = pdf.splitTextToSize(phase.description, cardWidth - 8);
      pdf.text(pDesc.slice(0, 2), margin + 4, bracePhaseY + 3.8);

      bracePhaseY += 10.5;
    });

    // Right: Clear Aligners
    const rightCardX = margin + cardWidth + 6;
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect(rightCardX, currentY, cardWidth, 80, 2, 2, "FD");

    pdf.setFillColor(139, 92, 246); // Violet
    pdf.rect(rightCardX, currentY, cardWidth, 6, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("OPTION 2: CLEAR ALIGNER THERAPY", rightCardX + 4, currentY + 4.3);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`Duration: ${analysisData.treatmentPlans.aligners.duration || "16-20 months"}`, rightCardX + 4, currentY + 11);

    let alignerPhaseY = currentY + 16;
    analysisData.treatmentPlans.aligners.phases.slice(0, 4).forEach((phase) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      pdf.setTextColor(30, 41, 59);
      pdf.text(`${phase.stage}: ${phase.title}`, rightCardX + 4, alignerPhaseY);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      const pDesc = pdf.splitTextToSize(phase.description, cardWidth - 8);
      pdf.text(pDesc.slice(0, 2), rightCardX + 4, alignerPhaseY + 3.8);

      alignerPhaseY += 10.5;
    });

    currentY += 86;

    // Clinician Signature & Notes Section
    pdf.setFillColor(248, 250, 252);
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, currentY, contentWidth, 34, 2, 2, "FD");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(15, 23, 42);
    pdf.text("CLINICIAN NOTES & APPROVAL SIGNATURE", margin + 4, currentY + 5.5);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);
    if (customNotes) {
      const noteLines = pdf.splitTextToSize(`Notes: ${customNotes}`, contentWidth - 65);
      pdf.text(noteLines.slice(0, 3), margin + 4, currentY + 11);
    } else {
      pdf.text("Treatment plan reviewed and agreed upon with patient/guardian.", margin + 4, currentY + 11);
    }

    // Signature Line
    const sigX = pageWidth - margin - 55;
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(0.3);
    pdf.line(sigX, currentY + 22, sigX + 50, currentY + 22);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text("Treating Orthodontist / Clinician Signature", sigX, currentY + 26);

    // Save File
    const cleanPatientName = (patient.name || "Patient").replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `CephAnalysis_${cleanPatientName}_${patient.id || "Report"}.pdf`;

    if (onProgress) onProgress("Downloading PDF...");
    pdf.save(fileName);

    if (onProgress) onProgress("Complete");
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
}
