import { Button } from "@/elements/button";
import { Card } from "@/elements/card";
import { AnalysisTab, CephAnalysisResult, CephStudy, EditableFindings, PatientInfo, PredictionObject } from "@/types";
import { computeCephFromKeypoints } from "@/utils/cephalometrics";
import { formatDateTime } from "@/utils/helpers";
import { generateCephPdfReport } from "@/utils/pdfExport";
import { Activity, AlertTriangle, ArrowLeft, Check, CheckCircle2, Clock3, Download, Eye, EyeOff, FileText, Layers, Move, Plus, Printer, Save, Sparkles, Trash2, User, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { MeasurementCard } from "./measurment-card";
import { Field } from "@/elements/field";
import { SummaryRow } from "./summary-row";
import { TreatmentCard } from "./treatment-card";
import { CephLandmarks } from "./cephlandmarks";


export function AnalysisView({
  study,
  onSave,
  onBack,
  onDelete,
  onNewAnalysis,
}: {
  study: CephStudy;
  onSave: (study: CephStudy) => void;
  onBack: () => void;
  onDelete: () => void;
  onNewAnalysis: () => void;
}) {
  const [imageSrc, setImageSrc] =
    useState<string | null>(study.imageSrc);

  const [landmarks, setLandmarks] =
    useState<PredictionObject[]>(
      study.landmarks || []
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [pdfGenerating, setPdfGenerating] =
    useState(false);

  const [pdfStatus, setPdfStatus] =
    useState("");

  const [imgDims, setImgDims] =
    useState(study.imageDimensions || {
      width: 800,
      height: 800,
    });

  const [showPlanes, setShowPlanes] =
    useState(true);

  const [showLabels, setShowLabels] =
    useState(true);

  const [patient, setPatient] =
    useState<PatientInfo>(study.patient);

  const [analysisData, setAnalysisData] =
    useState<CephAnalysisResult | null>(
      study.analysisData
    );

  const [editableFindings, setEditableFindings] =
    useState<EditableFindings>(
      study.editableFindings || {
        skeletal: "",
        dental: "",
        isConfirmed: false,
      }
    );

  const [selectedMalocclusion, setSelectedMalocclusion] =
    useState(
      study.selectedMalocclusion || "Class II"
    );

  const [customObjectives, setCustomObjectives] =
    useState<string[]>(
      study.customObjectives || []
    );

  const [newObjectiveInput, setNewObjectiveInput] =
    useState("");

  const [clinicianNotes, setClinicianNotes] =
    useState(study.clinicianNotes || "");

  const [activeTab, setActiveTab] =
    useState<AnalysisTab>("radiograph");

  const [savedMessage, setSavedMessage] =
    useState("");

  const imageRef =
    useRef<HTMLImageElement>(null);

  const cephContainerRef =
    useRef<HTMLDivElement>(null);

  /* =====================================================
     SAVE CURRENT STUDY
  ===================================================== */

  const buildCurrentStudy = (): CephStudy => {
    return {
      ...study,

      patient,

      imageSrc,

      imageDimensions: imgDims,

      landmarks,

      analysisData,

      editableFindings,

      selectedMalocclusion,

      customObjectives,

      clinicianNotes,

      updatedAt: new Date().toISOString(),
    };
  };

  const handleSave = () => {
    if (!patient.name.trim()) {
      alert("Please enter the patient's full name.");
      return;
    }

    const current = buildCurrentStudy();

    onSave(current);

    setSavedMessage("Analysis saved successfully.");

    window.setTimeout(() => {
      setSavedMessage("");
    }, 3000);
  };

  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError(null);

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      setImageSrc(result);
      setLandmarks([]);
      setAnalysisData(null);
      setEditableFindings({
        skeletal: "",
        dental: "",
        isConfirmed: false,
      });

      setActiveTab("radiograph");

      runDetection(result);
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     IMAGE LOAD
  ===================================================== */

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement>
  ) => {
    const img = e.currentTarget;

    setImgDims({
      width: img.naturalWidth || 800,
      height: img.naturalHeight || 800,
    });
  };

  /* =====================================================
     DETECTION
  ===================================================== */

  const runDetection = async (
    base64Image: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/detect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
            imageWidth: imgDims.width || 800,
            imageHeight: imgDims.height || 800,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to analyze cephalogram"
        );
      }

      if (data.predictions) {
        setLandmarks(data.predictions);
      }
    } catch (err: any) {
      console.error(
        "Detection error:",
        err
      );

      setError(
        err.message ||
          "An error occurred during cephalometric analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     AI ANALYSIS
  ===================================================== */

  const runAnalyze = async () => {
    if (!landmarks.length) {
      alert(
        "Please upload a cephalogram and detect landmarks first."
      );

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/ai-analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            landmark: landmarks,
            imageWidth: imgDims.width || 800,
            imageHeight: imgDims.height || 800,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to analyze cephalogram"
        );
      }

      if (data.measurements) {
        setAnalysisData(data);

        setEditableFindings({
          skeletal:
            data.aiFindings?.skeletal || "",
          dental:
            data.aiFindings?.dental || "",
          isConfirmed: false,
        });

        if (
          data.malocclusion?.classification
        ) {
          setSelectedMalocclusion(
            data.malocclusion.classification
          );
        }

        if (data.treatmentObjectives) {
          setCustomObjectives(
            data.treatmentObjectives
          );
        }

        setActiveTab("measurements");
      }
    } catch (err: any) {
      console.error(
        "Analysis error:",
        err
      );

      setError(
        err.message ||
          "An error occurred during cephalometric analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LANDMARK CORRECTION
  ===================================================== */

  const handleLandmarkChange = (
    updated: PredictionObject[]
  ) => {
    setLandmarks(updated);

    if (
      analysisData &&
      updated[0]?.keypoints
    ) {
      const realTimeAngles =
        computeCephFromKeypoints(
          updated[0].keypoints
        );

      setAnalysisData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          measurements: {
            ...prev.measurements,
            ...realTimeAngles,
          },
        };
      });
    }
  };

  /* =====================================================
     OBJECTIVES
  ===================================================== */

  const handleAddObjective = () => {
    if (!newObjectiveInput.trim()) return;

    setCustomObjectives((prev) => [
      ...prev,
      newObjectiveInput.trim(),
    ]);

    setNewObjectiveInput("");
  };

  const handleRemoveObjective = (
    index: number
  ) => {
    setCustomObjectives((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* =====================================================
     PDF
  ===================================================== */

  const handleDownloadPdf = async () => {
    if (!analysisData) {
      alert(
        "Please analyze the cephalogram before downloading the report."
      );

      return;
    }

    setPdfGenerating(true);
    setPdfStatus(
      "Initializing PDF report..."
    );

    try {
      await generateCephPdfReport({
        patient,
        analysisData,
        activeMalocclusion:
          selectedMalocclusion,
        confirmedFindings:
          editableFindings,
        customNotes: clinicianNotes,
        cephContainerElement:
          cephContainerRef.current,
        onProgress: (status) =>
          setPdfStatus(status),
      });
    } catch (err) {
      console.error(
        "PDF generation failed:",
        err
      );

      alert(
        "Failed to generate PDF report."
      );
    } finally {
      setPdfGenerating(false);
      setPdfStatus("");
    }
  };

  /* =====================================================
     VALUES
  ===================================================== */

  const pointCount =
    landmarks[0]?.keypoints?.length || 0;

  const status = loading
    ? "Analyzing"
    : analysisData
    ? "Complete"
    : imageSrc
    ? "Ready"
    : "Awaiting radiograph";

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#f7faf8] text-slate-900">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              title="Back to patients"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#166534]">
              <Activity className="h-5 w-5 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900">
                Ceph
                <span className="text-[#166534]">
                  Vision
                </span>
              </h1>

              <p className="hidden text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400 sm:block">
                Cephalometric Analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedMessage && (
              <span className="hidden items-center gap-1.5 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 sm:flex">
                <CheckCircle2 className="h-4 w-4" />
                {savedMessage}
              </span>
            )}

            <Button
              variant="secondary"
              onClick={handleSave}
              disabled={!patient.name.trim()}
            >
              <Save className="h-4 w-4 text-[#166534]" />
              <span className="hidden sm:inline">
                Save
              </span>
            </Button>

            <Button
              onClick={handleDownloadPdf}
              disabled={
                !analysisData ||
                pdfGenerating
              }
            >
              {pdfGenerating ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Download className="h-4 w-4" />
              )}

              <span className="hidden sm:inline">
                {pdfGenerating
                  ? "Generating..."
                  : "PDF"}
              </span>
            </Button>

            <Button
              variant="secondary"
              onClick={onNewAnalysis}
              className="hidden md:inline-flex"
            >
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        {/* =================================================
            PATIENT HEADER
        ================================================= */}

        <div className="mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 font-bold text-[#166534]">
              {patient.name
                ?.charAt(0)
                .toUpperCase() || "P"}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {patient.name ||
                    "New Patient"}
                </h2>

                <span className="rounded-full border border-green-100 bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
                  {status}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {patient.id || "No patient ID"}
                {patient.age
                  ? ` · ${patient.age} years`
                  : ""}
                {patient.sex
                  ? ` · ${patient.sex}`
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock3 className="h-4 w-4" />
            {study.updatedAt
              ? `Last saved ${formatDateTime(
                  study.updatedAt
                )}`
              : "Unsaved analysis"}
          </div>
        </div>

        {/* =================================================
            PATIENT DETAILS
        ================================================= */}

        <Card className="mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                Patient
              </p>

              <h3 className="mt-1 text-base font-bold text-slate-900">
                Clinical Information
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field
              label="Full Name"
              icon={<User className="h-3.5 w-3.5" />}
              value={patient.name}
              onChange={(value:string) =>
                setPatient({
                  ...patient,
                  name: value,
                })
              }
              placeholder="Patient full name"
            />

            <Field
              label="Patient ID"
              icon={
                <FileText className="h-3.5 w-3.5" />
              }
              value={patient.id}
              onChange={(value:string) =>
                setPatient({
                  ...patient,
                  id: value,
                })
              }
              placeholder="PT-00001"
            />

            <Field
              label="Age"
              value={patient.age}
              onChange={(value:string) =>
                setPatient({
                  ...patient,
                  age: value,
                })
              }
              placeholder="Age"
              type="number"
            />

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                Sex
              </label>

              <select
                value={patient.sex}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    sex: e.target.value,
                  })
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#166534] focus:ring-4 focus:ring-green-100"
              >
                <option value="">
                  Select sex
                </option>
                <option value="Female">
                  Female
                </option>
                <option value="Male">
                  Male
                </option>
              </select>
            </div>

            <Field
              label="Clinician"
              value={patient.doctorName}
              onChange={(value:string) =>
                setPatient({
                  ...patient,
                  doctorName: value,
                })
              }
              placeholder="Dr. Name"
            />
          </div>
        </Card>

        {/* =================================================
            NAVIGATION TABS
        ================================================= */}

        <div className="mb-6 flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {[
            {
              id: "radiograph" as const,
              label: "Radiograph",
              icon: Activity,
            },
            {
              id: "measurements" as const,
              label: "Measurements",
              icon: Activity,
            },
            {
              id: "findings" as const,
              label: "Clinical Findings",
              icon: FileText,
            },
            {
              id: "treatment" as const,
              label: "Treatment",
              icon: Layers,
            },
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`
                  flex cursor-pointer min-w-max flex-1 items-center justify-center gap-2
                  rounded-lg px-4 py-2.5
                  text-sm font-semibold
                  transition
                  ${
                    activeTab === tab.id
                      ? "bg-[#166534] text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            RADIOGRAPH
        ================================================= */}

        {activeTab === "radiograph" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="overflow-hidden">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                    Cephalogram
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Radiograph & Tracing
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    AI landmarks and cephalometric
                    reference planes.
                  </p>
                </div>

                {pointCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setShowPlanes(
                          !showPlanes
                        )
                      }
                      className={`
                        flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold
                        ${
                          showPlanes
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-slate-200 bg-white text-slate-500"
                        }
                      `}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      Planes
                    </button>

                    <button
                      onClick={() =>
                        setShowLabels(
                          !showLabels
                        )
                      }
                      className={`
                        flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold
                        ${
                          showLabels
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-slate-200 bg-white text-slate-500"
                        }
                      `}
                    >
                      {showLabels ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}

                      Labels
                    </button>

                    <span className="rounded-lg border border-green-100 bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                      {pointCount} landmarks
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                {!imageSrc ? (
                  <label className="flex min-h-[620px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center transition hover:border-green-300 hover:bg-green-50/30">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
                      <Activity className="h-9 w-9 text-[#166534]" />
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-slate-900">
                      Upload Lateral Cephalogram
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                      Upload the patient's lateral
                      cephalometric radiograph to begin
                      landmark detection and analysis.
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#166534] px-5 py-3 text-sm font-bold text-white shadow-sm">
                      <Plus className="h-4 w-4" />
                      Choose Radiograph
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <>
                    <div
                      ref={cephContainerRef}
                      className="relative mx-auto aspect-square w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-xl"
                    >
                      <img
                        ref={imageRef}
                        src={imageSrc}
                        alt="Patient cephalogram"
                        onLoad={handleImageLoad}
                        className="absolute inset-0 h-full w-full object-contain"
                      />

                      {pointCount > 0 && (
                        <CephLandmarks
                          landmarks={landmarks}
                          onLandmarkChange={
                            handleLandmarkChange
                          }
                          imageDimensions={
                            imgDims
                          }
                          showPlanes={
                            showPlanes
                          }
                          showLabels={
                            showLabels
                          }
                        />
                      )}

                      {loading && (
                        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 text-center backdrop-blur-sm">
                          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-green-400" />

                          <p className="mt-4 text-base font-bold text-white">
                            Analyzing Cephalogram
                          </p>

                          <p className="mt-1 max-w-sm px-5 text-xs leading-relaxed text-white/60">
                            Detecting anatomical landmarks
                            and preparing the cephalometric
                            analysis.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>
                          {imgDims.width} ×{" "}
                          {imgDims.height}px
                        </span>

                        {pointCount > 0 && (
                          <span className="flex items-center gap-1.5 font-semibold text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                            {pointCount} landmarks
                            detected
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50">
                          <Plus className="h-4 w-4 text-[#166534]" />
                          Replace Image

                          <input
                            type="file"
                            accept="image/*"
                            onChange={
                              handleImageUpload
                            }
                            className="hidden"
                          />
                        </label>

                        {pointCount > 0 && (
                          <Button
                            onClick={runAnalyze}
                            disabled={loading}
                          >
                            <Sparkles className="h-4 w-4" />
                            {loading
                              ? "Analyzing..."
                              : "Analyze"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {error && (
                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                    <div>
                      <p className="text-sm font-semibold">
                        Analysis Error
                      </p>

                      <p className="mt-1 text-xs leading-relaxed">
                        {error}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setError(null)
                      }
                      className="ml-auto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* SIDEBAR */}

            <div className="space-y-5">
              <Card className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                  Analysis Summary
                </p>

                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {analysisData
                    ? "Analysis Complete"
                    : "Awaiting Analysis"}
                </h3>

                <div className="mt-5 space-y-3">
                  <SummaryRow
                    label="Landmarks"
                    value={
                      pointCount
                        ? String(pointCount)
                        : "—"
                    }
                  />

                  <SummaryRow
                    label="Classification"
                    value={
                      analysisData?.malocclusion
                        ?.classification ||
                      "Pending"
                    }
                  />

                  <SummaryRow
                    label="ANB"
                    value={
                      analysisData?.measurements
                        ?.ANB?.value !==
                      undefined
                        ? `${analysisData.measurements.ANB.value}°`
                        : "—"
                    }
                  />

                  <SummaryRow
                    label="Clinician Review"
                    value={
                      editableFindings.isConfirmed
                        ? "Confirmed"
                        : "Pending"
                    }
                  />
                </div>
              </Card>

              {pointCount > 0 && (
                <Card className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                      <Move className="h-4 w-4 text-[#166534]" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Correct Landmarks
                      </h3>

                      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                        Drag any landmark directly on the
                        radiograph. Measurements update
                        automatically.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Study
                </p>

                <div className="mt-4 space-y-3">
                  <SummaryRow
                    label="Analysis Date"
                    value={patient.date}
                  />

                  <SummaryRow
                    label="Clinician"
                    value={
                      patient.doctorName ||
                      "Not recorded"
                    }
                  />
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* =================================================
            MEASUREMENTS
        ================================================= */}

        {activeTab === "measurements" && (
          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                    Cephalometrics
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Measurements
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Core cephalometric values and
                    normative reference ranges.
                  </p>
                </div>

                {analysisData && (
                  <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    Analysis Complete
                  </span>
                )}
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MeasurementCard
                name="SNA"
                fullName="Sella-Nasion-A Point"
                value={
                  analysisData?.measurements?.SNA
                    ?.value
                }
                norm="82° ± 2°"
                interpretation={
                  analysisData?.measurements?.SNA
                    ?.interpretation
                }
                status={
                  analysisData?.measurements?.SNA
                    ?.status || "pending"
                }
              />

              <MeasurementCard
                name="SNB"
                fullName="Sella-Nasion-B Point"
                value={
                  analysisData?.measurements?.SNB
                    ?.value
                }
                norm="80° ± 2°"
                interpretation={
                  analysisData?.measurements?.SNB
                    ?.interpretation
                }
                status={
                  analysisData?.measurements?.SNB
                    ?.status || "pending"
                }
              />

              <MeasurementCard
                name="ANB"
                fullName="A Point-Nasion-B Point"
                value={
                  analysisData?.measurements?.ANB
                    ?.value
                }
                norm="2° ± 2°"
                interpretation={
                  analysisData?.measurements?.ANB
                    ?.interpretation
                }
                status={
                  analysisData?.measurements?.ANB
                    ?.status || "pending"
                }
              />

              <MeasurementCard
                name="Wits"
                fullName="Wits Appraisal"
                value={
                  analysisData?.measurements?.Wits
                    ?.value
                }
                unit=""
                norm="≈ 0 mm"
                interpretation={
                  analysisData?.measurements?.Wits
                    ?.interpretation
                }
                status={
                  analysisData?.measurements?.Wits
                    ?.status || "pending"
                }
              />

              <MeasurementCard
                name="FMA"
                fullName="Frankfort Mandibular Angle"
                value={
                  analysisData?.measurements?.FMA
                    ?.value
                }
                norm="25° ± 3°"
                interpretation={
                  analysisData?.measurements?.FMA
                    ?.interpretation
                }
                status={
                  analysisData?.measurements?.FMA
                    ?.status || "pending"
                }
              />

              <MeasurementCard
                name="IMPA"
                fullName="Incisor Mandibular Plane Angle"
                value={
                  analysisData?.measurements?.IMPA
                    ?.value
                }
                norm="90° ± 4°"
                interpretation={
                  analysisData?.measurements?.IMPA
                    ?.interpretation
                }
                status={
                  analysisData?.measurements?.IMPA
                    ?.status || "pending"
                }
              />
            </div>
          </div>
        )}

        {/* =================================================
            FINDINGS
        ================================================= */}

        {activeTab === "findings" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                    Clinical Review
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-slate-900">
                    Diagnostic Findings
                  </h3>
                </div>

                {editableFindings.isConfirmed && (
                  <span className="flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    <Check className="h-3.5 w-3.5" />
                    Confirmed
                  </span>
                )}
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-800">
                      Skeletal Findings
                    </label>

                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Editable
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={
                      editableFindings.skeletal
                    }
                    onChange={(e) =>
                      setEditableFindings({
                        ...editableFindings,
                        skeletal:
                          e.target.value,
                      })
                    }
                    placeholder="Skeletal findings will appear here..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-800">
                      Dental Findings
                    </label>

                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Editable
                    </span>
                  </div>

                  <textarea
                    rows={6}
                    value={
                      editableFindings.dental
                    }
                    onChange={(e) =>
                      setEditableFindings({
                        ...editableFindings,
                        dental:
                          e.target.value,
                      })
                    }
                    placeholder="Dental findings will appear here..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:ring-4 focus:ring-green-100"
                  />
                </div>

                <Button
                  onClick={() =>
                    setEditableFindings({
                      ...editableFindings,
                      isConfirmed:
                        !editableFindings.isConfirmed,
                    })
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />

                  {editableFindings.isConfirmed
                    ? "Findings Confirmed"
                    : "Confirm Clinical Findings"}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                Diagnosis
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                Malocclusion Classification
              </h3>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  {
                    id: "Class I",
                    desc: "Neutrocclusion",
                  },
                  {
                    id: "Class II",
                    desc: "Distocclusion",
                  },
                  {
                    id: "Class III",
                    desc: "Mesiocclusion",
                  },
                ].map((item) => {
                  const active =
                    selectedMalocclusion.toLowerCase() === item?.id?.toLowerCase()

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setSelectedMalocclusion(
                          item.id
                        )
                      }
                      className={`
                        rounded-xl border p-4 text-center transition
                        ${
                          active
                            ? "border-green-300 bg-green-50 ring-2 ring-green-100"
                            : "border-slate-200 hover:border-green-200 hover:bg-slate-50"
                        }
                      `}
                    >
                      <div
                        className={`
                          mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold
                          ${
                            active
                              ? "bg-[#166534] text-white"
                              : "bg-slate-100 text-slate-500"
                          }
                        `}
                      >
                        {item.id.replace(
                          "Class ",
                          ""
                        )}
                      </div>

                      <p className="mt-2 text-sm font-bold text-slate-900">
                        {item.id}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  AI Classification
                </p>

                <p className="mt-2 text-lg font-bold text-[#166534]">
                  {analysisData?.malocclusion
                    ?.classification ||
                    selectedMalocclusion}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {analysisData?.malocclusion
                    ?.summary ||
                    "The AI diagnostic summary will appear here after analysis."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[10px] text-slate-400">
                      Skeletal Pattern
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-800">
                      {analysisData
                        ?.malocclusion
                        ?.skeletalPattern ||
                        "—"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[10px] text-slate-400">
                      Dental Pattern
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-800">
                      {analysisData
                        ?.malocclusion
                        ?.dentalPattern ||
                        "—"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* NOTES */}

            <Card className="p-6 lg:col-span-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                Clinical Notes
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                Clinician Notes
              </h3>

              <textarea
                rows={6}
                value={clinicianNotes}
                onChange={(e) =>
                  setClinicianNotes(
                    e.target.value
                  )
                }
                placeholder="Add clinical observations, treatment rationale, patient instructions or other notes..."
                className="mt-5 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#166534] focus:ring-4 focus:ring-green-100"
              />
            </Card>
          </div>
        )}

        {/* Treatment */}

        {activeTab === "treatment" && (
          <div className="space-y-6">
            <Card className="p-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                Treatment Planning
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-900">
                Treatment Objectives
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Patient-specific treatment objectives
                derived from the analysis.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {(customObjectives.length
                  ? customObjectives
                  : [
                      "Correct sagittal skeletal discrepancy",
                      "Establish bilateral Class I canine and molar relationship",
                      "Normalize overjet and overbite",
                      "Control lower incisor inclination",
                      "Coordinate upper and lower arches",
                      "Optimize facial profile",
                    ]
                ).map(
                  (objective, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[10px] font-bold text-[#166534]">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <p className="text-sm font-medium leading-relaxed text-slate-700">
                          {objective}
                        </p>
                      </div>

                      {customObjectives.length >
                        0 && (
                        <button
                          onClick={() =>
                            handleRemoveObjective(
                              index
                            )
                          }
                          className="text-slate-300 transition hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <input
                  value={newObjectiveInput}
                  onChange={(e) =>
                    setNewObjectiveInput(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddObjective();
                    }
                  }}
                  placeholder="Add treatment objective..."
                  className="h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#166534] focus:ring-4 focus:ring-green-100"
                />

                <Button
                  variant="secondary"
                  onClick={handleAddObjective}
                >
                  <Plus className="h-4 w-4 text-[#166534]" />
                  Add Objective
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <TreatmentCard
                title="Fixed Braces"
                duration={
                  analysisData?.treatmentPlans
                    ?.braces?.duration ||
                  "18–24 Months"
                }
                description={
                  analysisData?.treatmentPlans
                    ?.braces
                    ?.description ||
                  "Comprehensive fixed pre-adjusted edgewise appliance therapy."
                }
                phases={
                  analysisData?.treatmentPlans
                    ?.braces?.phases || []
                }
              />

              <TreatmentCard
                title="Clear Aligners"
                duration={
                  analysisData?.treatmentPlans
                    ?.aligners?.duration ||
                  "16–22 Months"
                }
                description={
                  analysisData?.treatmentPlans
                    ?.aligners
                    ?.description ||
                  "Sequential clear aligner therapy with staged tooth movement."
                }
                phases={
                  analysisData?.treatmentPlans
                    ?.aligners?.phases || []
                }
              />
            </div>
          </div>
        )}

        {/* SAVE / EXPORT FOOTER */}

        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-bold text-green-900">
                Save this patient analysis
              </p>

              <p className="mt-1 text-xs leading-relaxed text-green-700">
                Save the radiograph, landmarks, measurements,
                findings, treatment objectives and clinical
                notes so you can reopen this analysis later.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() =>
                  window.print()
                }
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>

              <Button
                onClick={handleSave}
                disabled={!patient.name.trim()}
              >
                <Save className="h-4 w-4" />
                Save Analysis
              </Button>
            </div>
          </div>
        </div>

        {/*
            DANGER ZONE */}

        <div className="mt-6 flex justify-end pb-10">
          <Button
            variant="danger"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete Analysis
          </Button>
        </div>
      </main>

      {/* PRINT STYLES */}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          header,
          button,
          input[type="file"] {
            display: none !important;
          }

          main {
            max-width: 100% !important;
          }

          .bg-white {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}