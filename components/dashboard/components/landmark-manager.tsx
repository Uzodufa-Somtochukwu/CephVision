import { Card } from "@/elements/card";
import { CEPH_LANDMARKS_KEYPOINTS } from "@/MOCK_DATA";
import { PredictionObject } from "@/types";

export const LandmarkManager = ({
  landmarks,
  selectedLandmarks,
  onToggle,
}: {
  landmarks: PredictionObject[];
  selectedLandmarks: string[];
  onToggle: (id: string) => void;
}) => {
  return (
   <div className="p-4">
     <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-white">
            Landmark Selection
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Select landmarks to include in analysis.
          </p>
        </div>

        <span className="text-xs text-green-600">
          {selectedLandmarks.length} selected
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {CEPH_LANDMARKS_KEYPOINTS.map((definition) => {
          const detected = landmarks.some((prediction) =>
            prediction.keypoints?.some((kp) =>
              definition.labels.some(
                (label) =>
                  kp.class?.toLowerCase().trim() ===
                  label.toLowerCase().trim()
              )
            )
          );

          const selected = selectedLandmarks.includes(definition.id);

          return (
            <button
              key={definition.id}
              type="button"
              disabled={!detected}
              onClick={() => onToggle(definition.id)}
              className={`border bg-green-50 px-3 py-2 text-xs font-bold text-green-700
                p-3 rounded-xl text-left transition
                ${
                  selected
                    ? "border-green-100 bg-green-50 text-green-700 "
                    : "border-red-800 bg-red-50 text-red-800 "
                }
                ${!detected ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold ">
                  {definition.abbreviation}
                </span>

                <span
                  className={`w-2 h-2 rounded-full ${
                    detected
                      ? "bg-emerald-400"
                      : "bg-slate-600"
                  }`}
                />
              </div>

              <div className="text-xs mt-1">
                {definition.name}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
   </div>
  );
}