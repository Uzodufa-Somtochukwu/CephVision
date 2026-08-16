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