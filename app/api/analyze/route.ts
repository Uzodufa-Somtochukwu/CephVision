import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.ROBOFLOW_API_KEY;
    const modelId = process.env.ROBOFLOW_MODEL_ID || 'cephvision';
    const version = process.env.ROBOFLOW_VERSION || '4';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Roboflow API key missing in environment variables.' },
        { status: 500 }
      );
    }

    const { image } = await request.json();
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided for landmark detection.' },
        { status: 400 }
      );
    }

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    // Call Roboflow Inference API for Keypoint / Pose model
    const roboflowUrl = `https://detect.roboflow.com/${modelId}/${version}?api_key=${apiKey}&format=json`;

    const response = await fetch(roboflowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: base64Data,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Roboflow API Error:', errorText);
      return NextResponse.json(
        { error: `Roboflow API call failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const predictions = data.predictions || [];

    // Extract all landmark keypoints across detected pose objects
    const extractedLandmarks: Array<{ class: string; x: number; y: number; confidence: number }> = [];

    predictions.forEach((pred: any) => {
      if (pred.keypoints && Array.isArray(pred.keypoints)) {
        pred.keypoints.forEach((kp: any) => {
          extractedLandmarks.push({
            class: kp.class_name || kp.name || pred.class || 'Landmark',
            x: kp.x,
            y: kp.y,
            confidence: kp.confidence ?? 1.0,
          });
        });
      } else {
        // Fallback for standard bounding-box centers if keypoints array isn't nested
        extractedLandmarks.push({
          class: pred.class,
          x: pred.x,
          y: pred.y,
          confidence: pred.confidence,
        });
      }
    });

    return NextResponse.json({ predictions: extractedLandmarks });
  } catch (error: any) {
    console.error('❌ Landmark Detection Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to detect cephalometric landmarks.' },
      { status: 500 }
    );
  }
}