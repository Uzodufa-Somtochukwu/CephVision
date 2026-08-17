import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
try {
const { image } = await req.json();

if (!image) {
return NextResponse.json({ error: 'No image provided' }, { status: 400 });
}

const apiKey = process.env.ROBOFLOW_API_KEY;
const modelEndpoint = process.env.ROBOFLOW_MODEL_ENDPOINT;

if (!apiKey || !modelEndpoint) {
return NextResponse.json(
{ error: 'Roboflow API key or Endpoint missing in .env.local' },
{ status: 500 }
);
}

const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
const roboflowUrl = `https://detect.roboflow.com/${modelEndpoint}?api_key=${apiKey}&confidence=1`;

const response = await fetch(roboflowUrl, {
method: 'POST',
headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
body: base64Data,
});

if (!response.ok) {
const err = await response.text();
return NextResponse.json({ error: err }, { status: response.status });
}

const data = await response.json();

let normalizedPredictions: any[] = [];

if (data.predictions && Array.isArray(data.predictions)) {
if (data.predictions[0]?.keypoints) {
normalizedPredictions = data.predictions;
} else {
const keypoints = data.predictions.map((p: any) => ({
class: p.class,
x: p.x,
y: p.y,
confidence: p.confidence,
}));
normalizedPredictions = [{ keypoints }];
}
}

return NextResponse.json({ predictions: normalizedPredictions, raw: data });
} catch (error: any) {
return NextResponse.json({ error: error.message }, { status: 500 });
}
}

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
//     const { image, imageWidth = 800, imageHeight = 800 } =
//       await req.json();

//     if (!image) {
//       return NextResponse.json(
//         {
//           error: "No image provided",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     const roboflowApiKey =
//       process.env.ROBOFLOW_API_KEY;

//     const modelEndpoint =
//       process.env.ROBOFLOW_MODEL_ENDPOINT;

//     if (!roboflowApiKey || !modelEndpoint) {
//       return NextResponse.json(
//         {
//           error:
//             "Roboflow API key or model endpoint is missing",
//         },
//         {
//           status: 500,
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

//     const roboflowUrl =
//       `https://detect.roboflow.com/${modelEndpoint}` +
//       `?api_key=${roboflowApiKey}` +
//       `&confidence=1`;

//     const roboflowResponse = await fetch(
//       roboflowUrl,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type":
//             "application/x-www-form-urlencoded",
//         },
//         body: base64Data,
//       }
//     );

//     if (!roboflowResponse.ok) {
//       const errorText =
//         await roboflowResponse.text();

//       return NextResponse.json(
//         {
//           error:
//             "Roboflow detection failed",
//           details: errorText,
//         },
//         {
//           status: roboflowResponse.status,
//         }
//       );
//     }

//     const roboflowData =
//       await roboflowResponse.json();

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
//       predictions: [
//         {
//           keypoints,
//         },
//       ],

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