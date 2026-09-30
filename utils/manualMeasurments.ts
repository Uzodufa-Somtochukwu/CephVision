import { useAppContext } from "@/providers/context-provider";

type MeasurementStatus = "normal" | "low" | "high";

interface Measurement {
  value: number;
  norm: string;
  interpretation: string;
  status: MeasurementStatus;
}

const useGetManualMeasurement = () => {
  const { getAngle,angles } = useAppContext();
const getManualMeasurement  = () => {



  const measurements: Record<string, Measurement> = {};

  /**
   * Helper for angle measurements
   */
  const addMeasurement = (
    label: string,
    norm: string,
    normalMin: number,
    normalMax: number,
    interpretations: {
      low: string;
      normal: string;
      high: string;
    }
  ) => {
    const value = angles[label]?.value;

    // Don't create a measurement if it hasn't been calculated yet
    if (value === undefined || !Number.isFinite(value)) {
      return;
    }

    let status: MeasurementStatus = "normal";
    let interpretation = interpretations.normal;

    if (value < normalMin) {
      status = "low";
      interpretation = interpretations.low;
    } else if (value > normalMax) {
      status = "high";
      interpretation = interpretations.high;
    }

    measurements[label] = {
      value,
      norm: `${(normalMin + normalMax) / 2}° (± ${
        (normalMax - normalMin) / 2
      }°)`,
      interpretation,
      status,
    };
  };

  // ------------------------------------------------
  // SKELETAL
  // ------------------------------------------------

  addMeasurement(
    "SNA",
    "82° (± 2°)",
    80,
    84,
    {
      low: "Maxillary retrognathism / retrusion",
      normal: "Normal maxillary position",
      high: "Maxillary prognathism / protrusion",
    }
  );

  addMeasurement(
    "SNB",
    "80° (± 2°)",
    78,
    82,
    {
      low: "Mandibular retrognathism / retrusion",
      normal: "Normal mandibular position",
      high: "Mandibular prognathism / protrusion",
    }
  );

  addMeasurement(
    "ANB",
    "2° (± 2°)",
    0,
    4,
    {
      low: "Skeletal Class III tendency",
      normal: "Normal maxillomandibular sagittal relationship",
      high: "Skeletal Class II tendency",
    }
  );

  // ------------------------------------------------
  // VERTICAL
  // ------------------------------------------------

  addMeasurement(
    "FMA",
    "25° (± 5°)",
    20,
    30,
    {
      low: "Low-angle / horizontal growth tendency",
      normal: "Average vertical skeletal pattern",
      high: "High-angle / vertical growth tendency",
    }
  );
  addMeasurement(
    "MMPA",
    "25° (± 5°)",
    20,
    30,
    {
      low: "Low-angle / horizontal growth tendency",
      normal: "Average vertical skeletal pattern",
      high: "High-angle / vertical growth tendency",
    }
  );

  // ------------------------------------------------
  // DENTAL
  // ------------------------------------------------

  addMeasurement(
    "IMPA",
    "90° (± 5°)",
    85,
    95,
    {
      low: "Retroclined mandibular incisors",
      normal: "Normal mandibular incisor inclination",
      high: "Proclined mandibular incisors",
    }
  );

  addMeasurement(
    "IIncisal",
    "130° (± 6°)",
    124,
    136,
    {
      low: "Proclined incisors / reduced interincisal angle",
      normal: "Normal interincisal angle",
      high: "Retroclined incisors / increased interincisal angle",
    }
  );

   addMeasurement(
    "IFPA",
    "65° (± 3°)",
    62,
    68,
    {
      low: "Increased mandibular incisor inclination",
      normal: "Normal interincisal angle",
      high: "Reduced mandibular incisor inclination",
    }
  );

  addMeasurement(
    "U1_SN",
    "102° (± 3°)",
    100,
    105,
    {
      low: "Retroclined maxillary incisors",
      normal: "Normal maxillary incisor inclination",
      high: "Proclined maxillary incisors",
    }
  );

  // ------------------------------------------------
  // CERVICAL / CRANIAL BASE
  // ------------------------------------------------

  addMeasurement(
    "Saddle",
    "123° (± 5°)",
    118,
    128,
    {
      low: "Reduced cranial base saddle angle",
      normal: "Normal saddle angle",
      high: "Increased cranial base saddle angle",
    }
  );

  addMeasurement(
    "Articular",
    "143° (± 6°)",
    137,
    149,
    {
      low: "Reduced articular angle",
      normal: "Normal articular angle",
      high: "Increased articular angle",
    }
  );

  // ------------------------------------------------
  // GONIAL
  // ------------------------------------------------

  addMeasurement(
    "Gonial",
    "130° (± 7°)",
    123,
    137,
    {
      low: "Reduced gonial angle",
      normal: "Normal gonial angle",
      high: "Increased gonial angle",
    }
  );

  addMeasurement(
    "Upper_Gonial",
    "52° (± 4°)",
    48,
    56,
    {
      low: "Reduced upper gonial angle",
      normal: "Normal upper gonial angle",
      high: "Increased upper gonial angle",
    }
  );

  addMeasurement(
    "Lower_Gonial",
    "75° (± 5°)",
    70,
    80,
    {
      low: "Reduced lower gonial angle",
      normal: "Normal lower gonial angle",
      high: "Increased lower gonial angle",
    }
  );

  // ------------------------------------------------
  // SOFT TISSUE
  // ------------------------------------------------

  addMeasurement(
    "H_Angle",
    "10–15°",
    10,
    15,
    {
      low: "Reduced soft-tissue convexity",
      normal: "Normal soft-tissue facial convexity",
      high: "Increased soft-tissue convexity",
    }
  );

  addMeasurement(
    "Z_Angle",
    "75–80°",
    75,
    80,
    {
      low: "Reduced soft-tissue profile angle",
      normal: "Normal soft-tissue profile",
      high: "Reduced soft-tissue profile angle / increased convexity",
    }
  );

  // ------------------------------------------------
  // LINEAR / FACIAL HEIGHT MEASUREMENTS
  // ------------------------------------------------

  addMeasurement(
    "LFH",
    "Approximately 55–65 mm",
    55,
    65,
    {
      low: "Reduced lower facial height",
      normal: "Normal lower facial height",
      high: "Increased lower facial height",
    }
  );

  addMeasurement(
    "AFH",
    "Approximately 110–125 mm",
    110,
    125,
    {
      low: "Reduced anterior facial height",
      normal: "Normal anterior facial height",
      high: "Increased anterior facial height",
    }
  );

  addMeasurement(
    "PFH",
    "Approximately 70–85 mm",
    70,
    85,
    {
      low: "Reduced posterior facial height",
      normal: "Normal posterior facial height",
      high: "Increased posterior facial height",
    }
  );

  // ------------------------------------------------
  // SOFT TISSUE LINEAR
  // ------------------------------------------------

  addMeasurement(
    "LL-S",
    "0 ± 2 mm",
    -2,
    2,
    {
      low: "Lower lip is retrusive relative to the S-line",
      normal: "Lower lip is within the normal S-line relationship",
      high: "Lower lip is protrusive relative to the S-line",
    }
  );

  addMeasurement(
    "LL-E",
    "-2 ± 2 mm",
    -4,
    0,
    {
      low: "Lower lip is retrusive relative to the E-line",
      normal: "Lower lip is within the normal E-line relationship",
      high: "Lower lip is protrusive relative to the E-line",
    }
  );

  addMeasurement(
    "UL-S",
    "0 ± 2 mm",
    -2,
    2,
    {
      low: "Upper lip is retrusive relative to the S-line",
      normal: "Upper lip is within the normal S-line relationship",
      high: "Upper lip is protrusive relative to the S-line",
    }
  );

  addMeasurement(
    "UL-E",
    "-4 ± 2 mm",
    -6,
    -2,
    {
      low: "Upper lip is retrusive relative to the E-line",
      normal: "Upper lip is within the normal E-line relationship",
      high: "Upper lip is protrusive relative to the E-line",
    }
  );

  return measurements;


}
return {getManualMeasurement}
};

export default useGetManualMeasurement;
