

"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  PredictionObject,
  Keypoint,
  CephStudy,
  ViewMode,
} from "@/types";

import {
  Activity
} from "lucide-react";

import { createEmptyStudy } from "@/utils/helpers";
import { Card } from "@/elements/card";
import { loadStudies, saveStudies } from "@/utils/storage/localstorage";
import { PatientList } from "@/components/dashboard/components/patient-list";
import { PatientHistory } from "@/components/dashboard/components/patient-history";
import { AnalysisView } from "@/components/dashboard/components/analysis-view";

export default function App() {
  const [studies, setStudies] =
    useState<CephStudy[]>([]);

  const [currentStudy, setCurrentStudy] =
    useState<CephStudy | null>(null);

  const [viewMode, setViewMode] =
    useState<ViewMode>("patients");

  const [selectedPatientStudy, setSelectedPatientStudy] =
    useState<CephStudy | null>(null);

  const [hydrated, setHydrated] =
    useState(false);

  /* =====================================================
     LOAD STORAGE
  ===================================================== */

  useEffect(() => {
    const stored = loadStudies();

    setStudies(stored);

    setHydrated(true);
  }, []);

  /* =====================================================
     PERSIST
   */

  useEffect(() => {
    if (!hydrated) return;

    saveStudies(studies);
  }, [studies, hydrated]);

  /*  NEW ANALYSIS */

  const handleNewAnalysis = () => {
    const newStudy = createEmptyStudy();

    setCurrentStudy(newStudy);
    setViewMode("analysis");
    setSelectedPatientStudy(null);
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSaveStudy = (
    updatedStudy: CephStudy
  ) => {
    setStudies((prev) => {
      const existingIndex =
        prev.findIndex(
          (study) =>
            study.id === updatedStudy.id
        );

      if (existingIndex === -1) {
        return [
          updatedStudy,
          ...prev,
        ];
      }

      const updated = [...prev];

      updated[existingIndex] =
        updatedStudy;

      return updated;
    });

    setCurrentStudy(updatedStudy);
  };

  /* =====================================================
     OPEN STUDY
  ===================================================== */

  const handleOpenStudy = (
    study: CephStudy
  ) => {
    setCurrentStudy(study);
    setViewMode("analysis");
  };

  /* OPEN PATIENT */

  const handleOpenPatient = (
    study: CephStudy
  ) => {
    setSelectedPatientStudy(study);
    setViewMode("patients");
  };

  /* DELETE */

  const handleDeleteStudy = () => {
    if (!currentStudy) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis? This cannot be undone."
    );

    if (!confirmed) return;

    setStudies((prev) =>
      prev.filter(
        (study) =>
          study.id !== currentStudy.id
      )
    );

    setCurrentStudy(null);
    setViewMode("patients");
  };

  /* LOADING  */

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7faf8]">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#166534]">
            <Activity className="h-6 w-6 text-white" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Loading CephVision...
          </p>
        </div>
      </div>
    );
  }

  /* PATIENT HISTORY */

  if (
    viewMode === "patients" &&
    selectedPatientStudy
  ) {
    return (
      <PatientHistory
        study={selectedPatientStudy}
        studies={studies}
        onBack={() =>
          setSelectedPatientStudy(null)
        }
        onOpenStudy={handleOpenStudy}
        onNewAnalysis={handleNewAnalysis}
      />
    );
  }

  /* PATIENT LIST */

  if (
    viewMode === "patients" &&
    !selectedPatientStudy
  ) {
    return (
      <PatientList
        studies={studies}
        onNewAnalysis={handleNewAnalysis}
        onOpenPatient={
          handleOpenPatient
        }
      />
    );
  }

  /* ANALYSIS */

  if (currentStudy) {
    return (
      <AnalysisView
        study={currentStudy}
        onSave={handleSaveStudy}
        onBack={() => {
          setCurrentStudy(null);
          setViewMode("patients");
        }}
        onDelete={handleDeleteStudy}
        onNewAnalysis={handleNewAnalysis}
      />
    );
  }

  return null;
}
