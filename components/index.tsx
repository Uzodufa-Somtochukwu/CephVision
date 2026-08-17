
// import { GoogleGenAI, Type } from "@google/genai";



// function getGeminiClient(): GoogleGenAI | null {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) {
//     console.warn("GEMINI_API_KEY is not set. Using intelligent anatomical fallback.");
//     return null;
//   }
//   return new GoogleGenAI({
//     apiKey: apiKey,
//     httpOptions: {
//       headers: {
//         "User-Agent": "aistudio-build",
//       },
//     },
//   });
// }

// // Generate realistic anatomical landmarks based on standard lateral ceph proportions


// async function startServer() {
//   const app = express();
//   const PORT = 3000;



//   // Main cephalometric detection & full orthodontic analysis endpoint
//   app.post(["/api/detect"], async (req, res) => {
//     try {
//       const { image, imageWidth = 800, imageHeight = 800 } = req.body;

//       if (!image) {
//         return res.status(400).json({ error: "No image provided for cephalometric analysis." });
//       }

//       // Clean base64 image data
//       let base64Data = image;
//       let mimeType = "image/jpeg";
//       if (image.startsWith("data:")) {
//         const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
//         if (matches && matches.length === 3) {
//           mimeType = matches[1];
//           base64Data = matches[2];
//         }
//       }

//       const ai = getGeminiClient();
//       // Construct Gemini multimodal prompt
//       const systemInstruction = `You are an expert Board-Certified Orthodontist and AI Cephalometric Radiograph Specialist.
// Analyze the uploaded lateral cephalometric radiograph (cephalogram) with high diagnostic precision.

// You must:

// 1. Calculate and return standard cephalometric measurements:
//    - SNA angle (Norm: 82.0° ± 2.0°)
//    - SNB angle (Norm: 80.0° ± 2.0°)
//    - ANB angle (Norm: 2.0° ± 2.0°)
//    - Wits appraisal (Norm: 0.0 mm / Males -1mm, Females 0mm)
//    - FMA (Frankfort-Mandibular Plane Angle, Norm: 25.0° ± 3.0°)
//    - IMPA (Incisor Mandibular Plane Angle, Norm: 90.0° ± 4.0°)
//    For each measurement provide: exact numerical value, reference norm string, clinical interpretation, and status ('normal', 'low', or 'high').

// 2. Provide structured AI Findings:
//    - Skeletal Findings: comprehensive assessment of maxillary/mandibular sagittal position, jaw relationship (Class I/II/III), vertical facial divergence (hypo/normo/hyperdivergent), and mandibular plane steepness.
//    - Dental Findings: maxillary and mandibular incisor inclination, overjet, overbite, crowding/spacing, and occlusal plane.
//    - Soft Tissue: profile convexity/straightness, E-line lip position, nasolabial angle.
//    - Growth Pattern: summary of vertical and sagittal growth trends.

// 3. Malocclusion Classification:
//    - Classification: ("Class I", "Class II", "Class III", "Class II Div 1", or "Class II Div 2")
//    - Subtype description
//    - Clinical summary
//    - Skeletal pattern description
//    - Dental pattern description
//    - Severity ("Mild", "Moderate", or "Severe")

// 4. Treatment Objectives:
//    - An array of 6-8 specific, measurable clinical objectives tailored to this patient's cephalometric deviations.

// 5. Treatment Plans for both Fixed Braces and Clear Aligners:
//    - Detailed phase breakdown (5 stages each)
//    - Appliance specifications (wire progression, bracket prescription, aligner stages, IPR prescriptions, elastics, anchorage)
//    - Estimated duration (months)
//    - Key clinical advantages.`;

//       const prompt = `Analyze this lateral cephalometric radiograph.
// Identify all anatomical landmarks (x, y coordinates within ${imageWidth}x${imageHeight}), compute SNA, SNB, ANB, Wits, FMA, IMPA, diagnose skeletal & dental findings, determine malocclusion classification, generate specific treatment objectives, and provide comprehensive treatment pathways for both Fixed Braces and Clear Aligners.`;

//       const response = await ai.models.generateContent({
//         model: "gemini-3.7-flash",
//         contents: [
//           {
//             parts: [
//               {
//                 inlineData: {
//                   mimeType: mimeType,
//                   data: base64Data,
//                 },
//               },
//               {
//                 text: prompt,
//               },
//             ],
//           },
//         ],
//         config: {
//           systemInstruction: systemInstruction,
//           responseMimeType: "application/json",
//           responseSchema: {
//             type: Type.OBJECT,
//             properties: {
//               keypoints: {
//                 type: Type.ARRAY,
//                 items: {
//                   type: Type.OBJECT,
//                   properties: {
//                     class: { type: Type.STRING },
//                     x: { type: Type.NUMBER },
//                     y: { type: Type.NUMBER },
//                     confidence: { type: Type.NUMBER },
//                   },
//                   required: ["class", "x", "y"],
//                 },
//               },
//               measurements: {
//                 type: Type.OBJECT,
//                 properties: {
//                   SNA: {
//                     type: Type.OBJECT,
//                     properties: {
//                       value: { type: Type.NUMBER },
//                       norm: { type: Type.STRING },
//                       interpretation: { type: Type.STRING },
//                       status: { type: Type.STRING },
//                     },
//                     required: ["value", "norm", "interpretation", "status"],
//                   },
//                   SNB: {
//                     type: Type.OBJECT,
//                     properties: {
//                       value: { type: Type.NUMBER },
//                       norm: { type: Type.STRING },
//                       interpretation: { type: Type.STRING },
//                       status: { type: Type.STRING },
//                     },
//                     required: ["value", "norm", "interpretation", "status"],
//                   },
//                   ANB: {
//                     type: Type.OBJECT,
//                     properties: {
//                       value: { type: Type.NUMBER },
//                       norm: { type: Type.STRING },
//                       interpretation: { type: Type.STRING },
//                       status: { type: Type.STRING },
//                     },
//                     required: ["value", "norm", "interpretation", "status"],
//                   },
//                   Wits: {
//                     type: Type.OBJECT,
//                     properties: {
//                       value: { type: Type.STRING },
//                       norm: { type: Type.STRING },
//                       interpretation: { type: Type.STRING },
//                       status: { type: Type.STRING },
//                     },
//                     required: ["value", "norm", "interpretation", "status"],
//                   },
//                   FMA: {
//                     type: Type.OBJECT,
//                     properties: {
//                       value: { type: Type.NUMBER },
//                       norm: { type: Type.STRING },
//                       interpretation: { type: Type.STRING },
//                       status: { type: Type.STRING },
//                     },
//                     required: ["value", "norm", "interpretation", "status"],
//                   },
//                   IMPA: {
//                     type: Type.OBJECT,
//                     properties: {
//                       value: { type: Type.NUMBER },
//                       norm: { type: Type.STRING },
//                       interpretation: { type: Type.STRING },
//                       status: { type: Type.STRING },
//                     },
//                     required: ["value", "norm", "interpretation", "status"],
//                   },
//                 },
//                 required: ["SNA", "SNB", "ANB", "Wits", "FMA", "IMPA"],
//               },
//               aiFindings: {
//                 type: Type.OBJECT,
//                 properties: {
//                   skeletal: { type: Type.STRING },
//                   dental: { type: Type.STRING },
//                   softTissue: { type: Type.STRING },
//                   growthPattern: { type: Type.STRING },
//                 },
//                 required: ["skeletal", "dental"],
//               },
//               malocclusion: {
//                 type: Type.OBJECT,
//                 properties: {
//                   classification: { type: Type.STRING },
//                   subtype: { type: Type.STRING },
//                   summary: { type: Type.STRING },
//                   skeletalPattern: { type: Type.STRING },
//                   dentalPattern: { type: Type.STRING },
//                   severity: { type: Type.STRING },
//                 },
//                 required: ["classification", "summary", "skeletalPattern", "dentalPattern", "severity"],
//               },
//               treatmentObjectives: {
//                 type: Type.ARRAY,
//                 items: { type: Type.STRING },
//               },
//               treatmentPlans: {
//                 type: Type.OBJECT,
//                 properties: {
//                   braces: {
//                     type: Type.OBJECT,
//                     properties: {
//                       title: { type: Type.STRING },
//                       description: { type: Type.STRING },
//                       duration: { type: Type.STRING },
//                       phases: {
//                         type: Type.ARRAY,
//                         items: {
//                           type: Type.OBJECT,
//                           properties: {
//                             stage: { type: Type.STRING },
//                             title: { type: Type.STRING },
//                             description: { type: Type.STRING },
//                             details: { type: Type.STRING },
//                           },
//                           required: ["stage", "title", "description"],
//                         },
//                       },
//                       specifications: {
//                         type: Type.ARRAY,
//                         items: {
//                           type: Type.OBJECT,
//                           properties: {
//                             label: { type: Type.STRING },
//                             value: { type: Type.STRING },
//                           },
//                           required: ["label", "value"],
//                         },
//                       },
//                       advantages: {
//                         type: Type.ARRAY,
//                         items: { type: Type.STRING },
//                       },
//                     },
//                     required: ["title", "description", "duration", "phases", "specifications", "advantages"],
//                   },
//                   aligners: {
//                     type: Type.OBJECT,
//                     properties: {
//                       title: { type: Type.STRING },
//                       description: { type: Type.STRING },
//                       duration: { type: Type.STRING },
//                       phases: {
//                         type: Type.ARRAY,
//                         items: {
//                           type: Type.OBJECT,
//                           properties: {
//                             stage: { type: Type.STRING },
//                             title: { type: Type.STRING },
//                             description: { type: Type.STRING },
//                             details: { type: Type.STRING },
//                           },
//                           required: ["stage", "title", "description"],
//                         },
//                       },
//                       specifications: {
//                         type: Type.ARRAY,
//                         items: {
//                           type: Type.OBJECT,
//                           properties: {
//                             label: { type: Type.STRING },
//                             value: { type: Type.STRING },
//                           },
//                           required: ["label", "value"],
//                         },
//                       },
//                       advantages: {
//                         type: Type.ARRAY,
//                         items: { type: Type.STRING },
//                       },
//                     },
//                     required: ["title", "description", "duration", "phases", "specifications", "advantages"],
//                   },
//                 },
//                 required: ["braces", "aligners"],
//               },
//             },
//             required: ["keypoints", "measurements", "aiFindings", "malocclusion", "treatmentObjectives", "treatmentPlans"],
//           },
//         },
//       });

//       const responseText = response.text;
//       if (!responseText) {
//         throw new Error("No response returned by Gemini model.");
//       }

//       const parsedData = JSON.parse(responseText);

//       // Structure predictions array to match existing app expectations
//       const formattedPredictions = [
//         {
//           keypoints: parsedData.keypoints || [],
//         },
//       ];

//       return res.json({
//         predictions: formattedPredictions,
//         measurements: parsedData.measurements,
//         aiFindings: parsedData.aiFindings,
//         malocclusion: parsedData.malocclusion,
//         treatmentObjectives: parsedData.treatmentObjectives,
//         treatmentPlans: parsedData.treatmentPlans,
//       });
//     } catch (err: any) {
//       console.error("Gemini cephalometric analysis error:", err);
//       // If error occurred during vision API, return fallback analysis gracefully so user workflow continues

//     }
//   });

 
// }

// startServer();
