// const measurementSchema = {
//   type: Type.OBJECT,

//   properties: {
//     value: {
//       type: Type.NUMBER,
//     },

//     unit: {
//       type: Type.STRING,
//     },

//     norm: {
//       type: Type.STRING,
//     },

//     interpretation: {
//       type: Type.STRING,
//     },

//     status: {
//       type: Type.STRING,
//     },
//   },

//   required: [
//     "value",
//     "unit",
//     "norm",
//     "interpretation",
//     "status",
//   ],
// };

// const treatmentPlanSchema = {
//   type: Type.OBJECT,

//   properties: {
//     title: {
//       type: Type.STRING,
//     },

//     description: {
//       type: Type.STRING,
//     },

//     duration: {
//       type: Type.STRING,
//     },

//     phases: {
//       type: Type.ARRAY,

//       items: {
//         type: Type.OBJECT,

//         properties: {
//           stage: {
//             type: Type.STRING,
//           },

//           title: {
//             type: Type.STRING,
//           },

//           description: {
//             type: Type.STRING,
//           },

//           details: {
//             type: Type.STRING,
//           },
//         },

//         required: [
//           "stage",
//           "title",
//           "description",
//           "details",
//         ],
//       },
//     },

//     specifications: {
//       type: Type.ARRAY,

//       items: {
//         type: Type.OBJECT,

//         properties: {
//           label: {
//             type: Type.STRING,
//           },

//           value: {
//             type: Type.STRING,
//           },
//         },

//         required: [
//           "label",
//           "value",
//         ],
//       },
//     },

//     advantages: {
//       type: Type.ARRAY,

//       items: {
//         type: Type.STRING,
//       },
//     },
//   },

//   required: [
//     "title",
//     "description",
//     "duration",
//     "phases",
//     "specifications",
//     "advantages",
//   ],
// };

// const analysisSchema = {
//   type: Type.OBJECT,

//   properties: {
//     measurements: {
//       type: Type.OBJECT,

//       properties: {
//         SNA: measurementSchema,
//         SNB: measurementSchema,
//         ANB: measurementSchema,
//         Wits: measurementSchema,
//         FMA: measurementSchema,
//         IMPA: measurementSchema,
//       },

//       required: [
//         "SNA",
//         "SNB",
//         "ANB",
//         "Wits",
//         "FMA",
//         "IMPA",
//       ],
//     },

//     aiFindings: {
//       type: Type.OBJECT,

//       properties: {
//         skeletal: {
//           type: Type.STRING,
//         },

//         dental: {
//           type: Type.STRING,
//         },

//         softTissue: {
//           type: Type.STRING,
//         },

//         growthPattern: {
//           type: Type.STRING,
//         },
//       },

//       required: [
//         "skeletal",
//         "dental",
//         "softTissue",
//         "growthPattern",
//       ],
//     },

//     malocclusion: {
//       type: Type.OBJECT,

//       properties: {
//         classification: {
//           type: Type.STRING,
//         },

//         subtype: {
//           type: Type.STRING,
//         },

//         summary: {
//           type: Type.STRING,
//         },

//         skeletalPattern: {
//           type: Type.STRING,
//         },

//         dentalPattern: {
//           type: Type.STRING,
//         },

//         severity: {
//           type: Type.STRING,
//         },
//       },

//       required: [
//         "classification",
//         "subtype",
//         "summary",
//         "skeletalPattern",
//         "dentalPattern",
//         "severity",
//       ],
//     },

//     treatmentObjectives: {
//       type: Type.ARRAY,

//       items: {
//         type: Type.STRING,
//       },
//     },

//     treatmentPlans: {
//       type: Type.OBJECT,

//       properties: {
//         braces: treatmentPlanSchema,

//         aligners: treatmentPlanSchema,
//       },

//       required: [
//         "braces",
//         "aligners",
//       ],
//     },
//   },

//   required: [
//     "measurements",
//     "aiFindings",
//     "malocclusion",
//     "treatmentObjectives",
//     "treatmentPlans",
//   ],
// };

// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenAI, Type } from "@google/genai";

// export const runtime = "nodejs";

// const getGeminiClient = () => {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     throw new Error("GEMINI_API_KEY is missing");
//   }

//   return new GoogleGenAI({
//     apiKey,
//   });
// };

// export async function POST(req: NextRequest) {
//   try {
//     const {landmark, imageWidth = 800, imageHeight = 800 } =
//       await req.json();

//     if (!landmark) {
//       return NextResponse.json(
//         {
//           error: "No landmark detected",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

    

//     /*
//     ============================================================
//     STEP 1
//     Send image to Roboflow
//     ============================================================
//     */

//     const base64Data = image.replace(
//       /^data:image\/(png|jpeg|jpg);base64,/,
//       ""
//     );

   

//     const roboflowData = landmark

//     /*
//     ============================================================
//     STEP 2
//     Normalize Roboflow landmarks
//     ============================================================
//     */

//     let keypoints: any[] = [];

//     if (
//       roboflowData.predictions &&
//       Array.isArray(roboflowData.predictions)
//     ) {
//       if (
//         roboflowData.predictions[0]?.keypoints
//       ) {
//         keypoints =
//           roboflowData.predictions[0].keypoints;
//       } else {
//         keypoints =
//           roboflowData.predictions.map(
//             (p: any) => ({
//               class: p.class,
//               x: p.x,
//               y: p.y,
//               confidence:
//                 p.confidence,
//             })
//           );
//       }
//     }

//     /*
//     ============================================================
//     STEP 3
//     Send Roboflow result to Gemini
//     ============================================================
//     */

//     const gemini = getGeminiClient();

//     const landmarkJSON = JSON.stringify(
//       keypoints,
//       null,
//       2
//     );

//     const systemInstruction = `
// You are an expert orthodontist and cephalometric
// analysis assistant.

// IMPORTANT:

// Roboflow has already detected the anatomical
// landmarks.

// Do NOT invent new landmark coordinates.

// Use the supplied Roboflow landmarks as the
// primary source for all geometric calculations.

// You may use the radiograph visually to understand
// the anatomy and verify whether the supplied
// landmarks appear clinically plausible.

// Calculate and interpret:

// SNA
// SNB
// ANB
// Wits appraisal
// FMA
// IMPA

// For every measurement return:

// - numerical value
// - unit
// - reference range
// - interpretation
// - status

// Status must be one of:

// normal
// low
// high

// Then provide:

// 1. Skeletal findings
// 2. Dental findings
// 3. Soft tissue findings
// 4. Growth pattern
// 5. Malocclusion classification
// 6. Treatment objectives
// 7. Fixed braces treatment pathway
// 8. Clear aligner treatment pathway

// IMPORTANT CLINICAL SAFETY:

// This is AI-assisted analysis.

// Do not present recommendations as a definitive
// diagnosis or prescription.

// Treatment recommendations must be reviewed,
// modified and confirmed by a qualified orthodontist.
// `;

//     const prompt = `
// Analyze this lateral cephalometric radiograph using
// the anatomical landmarks detected by Roboflow.

// IMAGE DIMENSIONS:

// Width: ${imageWidth}px
// Height: ${imageHeight}px

// ROBOFLOW LANDMARKS:

// ${landmarkJSON}

// Use these landmark coordinates to calculate the
// cephalometric measurements.

// Return the requested analysis as structured JSON.

// Do not change the landmark coordinates.

// If a measurement cannot be reliably calculated
// because a required landmark is missing, return
// "Unable to calculate" for that measurement rather
// than inventing a value.
// `;

//     /*
//     ============================================================
//     STEP 4
//     Gemini structured response
//     ============================================================
//     */

//     const geminiResponse =
//       await gemini.models.generateContent({
//         model: "gemini-3.6-flash",

//         contents: [
//           {
//             role: "user",

//             parts: [
//               {
//                 inlineData: {
//                   mimeType: getMimeType(image),
//                   data: getBase64(image),
//                 },
//               },

//               {
//                 text: prompt,
//               },
//             ],
//           },
//         ],

//         config: {
//           systemInstruction,

//           responseMimeType:
//             "application/json",

//           responseSchema:
//             analysisSchema,
//         },
//       });

//     const responseText =
//       geminiResponse.text;

//     if (!responseText) {
//       throw new Error(
//         "Gemini returned an empty response"
//       );
//     }

//     const analysis =
//       JSON.parse(responseText);

//     /*
//     ============================================================
//     STEP 5
//     Return BOTH Roboflow + Gemini
//     ============================================================
//     */

//     return NextResponse.json({
//       success: true,

//       // Original Roboflow landmarks
//     //   predictions: [
//     //     {
//     //       keypoints,
//     //     },
//     //   ],

//       // Gemini analysis
//       measurements:
//         analysis.measurements,

//       aiFindings:
//         analysis.aiFindings,

//       malocclusion:
//         analysis.malocclusion,

//       treatmentObjectives:
//         analysis.treatmentObjectives,

//       treatmentPlans:
//         analysis.treatmentPlans,

//       // Optional debugging
//       roboflow: {
//         predictions:
//           roboflowData.predictions,
//       },
//     });
//   } catch (error: any) {
//     console.error(
//       "Cephalometric analysis error:",
//       error
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         error:
//           error?.message ||
//           "Cephalometric analysis failed",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// function getBase64(image: string) {
//   return image.replace(
//     /^data:image\/(png|jpeg|jpg);base64,/,
//     ""
//   );
// }

// function getMimeType(image: string) {
//   const match = image.match(
//     /^data:(image\/[a-zA-Z0-9.+-]+);base64,/
//   );

//   return match?.[1] || "image/jpeg";
// }

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

export const runtime = "nodejs";

/* ============================================================
   SCHEMAS
============================================================ */

const measurementSchema = {
  type: Type.OBJECT,

  properties: {
    value: {
      type: Type.NUMBER,
    },

    unit: {
      type: Type.STRING,
    },

    norm: {
      type: Type.STRING,
    },

    interpretation: {
      type: Type.STRING,
    },

    status: {
      type: Type.STRING,
      enum: ["normal", "low", "high", "unavailable"],
    },
  },

  required: [
    "value",
    "unit",
    "norm",
    "interpretation",
    "status",
  ],
};

const treatmentPlanSchema = {
  type: Type.OBJECT,

  properties: {
    title: {
      type: Type.STRING,
    },

    description: {
      type: Type.STRING,
    },

    duration: {
      type: Type.STRING,
    },

    phases: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          stage: {
            type: Type.STRING,
          },

          title: {
            type: Type.STRING,
          },

          description: {
            type: Type.STRING,
          },

          details: {
            type: Type.STRING,
          },
        },

        required: [
          "stage",
          "title",
          "description",
          "details",
        ],
      },
    },

    specifications: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          label: {
            type: Type.STRING,
          },

          value: {
            type: Type.STRING,
          },
        },

        required: [
          "label",
          "value",
        ],
      },
    },

    advantages: {
      type: Type.ARRAY,

      items: {
        type: Type.STRING,
      },
    },
  },

  required: [
    "title",
    "description",
    "duration",
    "phases",
    "specifications",
    "advantages",
  ],
};

const analysisSchema = {
  type: Type.OBJECT,

  properties: {
    measurements: {
      type: Type.OBJECT,

      properties: {
        SNA: measurementSchema,
        SNB: measurementSchema,
        ANB: measurementSchema,
        Wits: measurementSchema,
        FMA: measurementSchema,
        IMPA: measurementSchema,
      },

      required: [
        "SNA",
        "SNB",
        "ANB",
        "Wits",
        "FMA",
        "IMPA",
      ],
    },

    aiFindings: {
      type: Type.OBJECT,

      properties: {
        skeletal: {
          type: Type.STRING,
        },

        dental: {
          type: Type.STRING,
        },

        softTissue: {
          type: Type.STRING,
        },

        growthPattern: {
          type: Type.STRING,
        },
      },

      required: [
        "skeletal",
        "dental",
        "softTissue",
        "growthPattern",
      ],
    },

    malocclusion: {
      type: Type.OBJECT,

      properties: {
        classification: {
          type: Type.STRING,
        },

        subtype: {
          type: Type.STRING,
        },

        summary: {
          type: Type.STRING,
        },

        skeletalPattern: {
          type: Type.STRING,
        },

        dentalPattern: {
          type: Type.STRING,
        },

        severity: {
          type: Type.STRING,
        },
      },

      required: [
        "classification",
        "subtype",
        "summary",
        "skeletalPattern",
        "dentalPattern",
        "severity",
      ],
    },

    treatmentObjectives: {
      type: Type.ARRAY,

      items: {
        type: Type.STRING,
      },
    },

    treatmentPlans: {
      type: Type.OBJECT,

      properties: {
        braces: treatmentPlanSchema,
        aligners: treatmentPlanSchema,
      },

      required: [
        "braces",
        "aligners",
      ],
    },
  },

  required: [
    "measurements",
    "aiFindings",
    "malocclusion",
    "treatmentObjectives",
    "treatmentPlans",
  ],
};

/* ============================================================
   GEMINI
============================================================ */

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing"
    );
  }

  return new GoogleGenAI({
    apiKey,
  });
};

/* ============================================================
   POST
============================================================ */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      landmark,
      imageWidth = 800,
      imageHeight = 800,
    } = body;

    if (!landmark) {
      return NextResponse.json(
        {
          success: false,
          error: "No landmark data provided",
        },
        {
          status: 400,
        }
      );
    }

    /* ========================================================
       NORMALIZE LANDMARKS
    ======================================================== */

    let keypoints: any[] = [];

    /*
      Case 1:

      {
        predictions: [
          {
            keypoints: [...]
          }
        ]
      }
    */

    if (
      landmark.predictions &&
      Array.isArray(landmark.predictions)
    ) {
      if (
        landmark.predictions[0]?.keypoints
      ) {
        keypoints =
          landmark.predictions[0].keypoints;
      } else {
        keypoints =
          landmark.predictions.map(
            (point: any) => ({
              class: point.class,
              x: point.x,
              y: point.y,
              confidence:
                point.confidence,
            })
          );
      }
    }

    /*
      Case 2:

      landmark itself is already an array
    */

    else if (Array.isArray(landmark)) {
      keypoints = landmark;
    }

    if (!keypoints.length) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No usable landmarks were found",
        },
        {
          status: 400,
        }
      );
    }

    /* ========================================================
       GEMINI
    ======================================================== */

    const gemini = getGeminiClient();

    const landmarkJSON = JSON.stringify(
      keypoints,
      null,
      2
    );

    /* ========================================================
       SYSTEM INSTRUCTION
    ======================================================== */

    const systemInstruction = `
You are an orthodontic cephalometric
analysis assistant.

You are NOT responsible for detecting
landmarks.

The landmarks have already been detected
by a computer vision model.

Your job is to analyze the supplied
landmark coordinates and produce a
structured cephalometric analysis.

IMPORTANT RULES:

1. Never invent landmark coordinates.

2. Never create a landmark that was not
provided.

3. Use only the supplied coordinates.

4. Do not assume a missing landmark.

5. If a required landmark is missing,
mark the corresponding measurement as
unavailable.

6. Consider the confidence value of each
landmark when interpreting the reliability
of a measurement.

7. Measurements should be calculated from
the supplied landmark geometry.

8. Clearly distinguish calculated
measurements from clinical interpretation.

Calculate:

- SNA
- SNB
- ANB
- Wits appraisal
- FMA
- IMPA

Then determine:

- skeletal findings
- dental findings
- soft tissue findings
- growth pattern
- malocclusion classification
- treatment objectives
- braces treatment pathway
- clear aligner treatment pathway

The result is an AI-assisted orthodontic
analysis and NOT a definitive diagnosis.

Treatment recommendations must be reviewed
and confirmed by a qualified orthodontist.
`;

    /* ========================================================
       USER PROMPT
    ======================================================== */

    const prompt = `
Analyze the following cephalometric
landmarks.

IMAGE DIMENSIONS:

Width: ${imageWidth}px
Height: ${imageHeight}px

DETECTED LANDMARKS:

${landmarkJSON}

Use the coordinates to perform the
cephalometric analysis.

Required measurements:

SNA
SNB
ANB
Wits
FMA
IMPA

For every measurement provide:

- value
- unit
- reference range
- interpretation
- status

Status must be:

normal
low
high
unavailable

If a required landmark is missing,
do NOT estimate the measurement.

Instead:

value: 0
status: "unavailable"

and explain in the interpretation
why the measurement could not be
calculated.

After calculating the measurements,
provide:

1. Skeletal findings
2. Dental findings
3. Soft tissue findings
4. Growth pattern
5. Malocclusion classification
6. Treatment objectives
7. Braces treatment pathway
8. Clear aligner treatment pathway

Return ONLY valid JSON matching
the supplied response schema.
`;

    /* ========================================================
       GEMINI REQUEST
    ======================================================== */

    const geminiResponse =
      await gemini.models.generateContent({
        model: "gemini-3.6-flash",

        contents: [
          {
            role: "user",

            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        config: {
          systemInstruction,

          responseMimeType:
            "application/json",

          responseSchema:
            analysisSchema,
        },
      });

    /* ========================================================
       PARSE RESPONSE
    ======================================================== */

    const responseText =
      geminiResponse.text;

    if (!responseText) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    const analysis =
      JSON.parse(responseText);

    /* ========================================================
       RETURN
    ======================================================== */

    return NextResponse.json({
      success: true,

      measurements:
        analysis.measurements,

      aiFindings:
        analysis.aiFindings,

      malocclusion:
        analysis.malocclusion,

      treatmentObjectives:
        analysis.treatmentObjectives,

      treatmentPlans:
        analysis.treatmentPlans,

      metadata: {
        landmarkCount:
          keypoints.length,

        imageWidth,

        imageHeight,
      },
    });

  } catch (error: any) {
    console.error(
      "Cephalometric analysis error:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ||
          "Cephalometric analysis failed",
      },
      {
        status: 500,
      }
    );
  }
}