'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import CephOutline from './CephOutline';

interface CephAlignerProps {
  imageSrc: string;
  landmarks?: any[];
  onLockAndAnalyze: (alignedImageDataUrl: string) => void;
}

export default function CephAligner({ imageSrc, landmarks = [], onLockAndAnalyze }: CephAlignerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);

  // Alignment Controls
  const [scale, setScale] = useState<number>(1.0);
  const [shiftX, setShiftX] = useState<number>(0);
  const [shiftY, setShiftY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [contrast, setContrast] = useState<number>(100);
  const [showOutline, setShowOutline] = useState<boolean>(true);

  // Load Image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      setImgElement(img);
      setScale(1.0);
      setShiftX(0);
      setShiftY(0);
      setRotation(0);
      setFlipped(false);
      setContrast(100);
    };
  }, [imageSrc]);

  // Render Pipeline
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 800;

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    ctx.filter = `contrast(${contrast}%)`;
    ctx.translate(width / 2 + shiftX, height / 2 + shiftY);
    ctx.rotate((rotation * Math.PI) / 180);

    const baseScale = Math.min(width / imgElement.width, height / imgElement.height);
    const finalScale = baseScale * scale;

    ctx.scale(flipped ? -finalScale : finalScale, finalScale);
    ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
    ctx.restore();

    // Predicted landmarks
    if (landmarks && landmarks.length > 0) {
      landmarks.forEach((pt) => {
        ctx.save();
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px sans-serif';
        ctx.fillText(pt.class || pt.class_name || '', pt.x + 6, pt.y + 3);
        ctx.restore();
      });
    }
  }, [imgElement, scale, shiftX, shiftY, rotation, flipped, contrast, landmarks]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Clean Export function
  const handleLockAndExport = () => {
    if (!imgElement) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 800;
    exportCanvas.height = 800;
    const exportCtx = exportCanvas.getContext('2d');

    if (!exportCtx) return;

    const width = 800;
    const height = 800;

    exportCtx.clearRect(0, 0, width, height);
    exportCtx.save();
    exportCtx.filter = `contrast(${contrast}%)`;
    exportCtx.translate(width / 2 + shiftX, height / 2 + shiftY);
    exportCtx.rotate((rotation * Math.PI) / 180);

    const baseScale = Math.min(width / imgElement.width, height / imgElement.height);
    const finalScale = baseScale * scale;

    exportCtx.scale(flipped ? -finalScale : finalScale, finalScale);
    exportCtx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
    exportCtx.restore();

    const dataUrl = exportCanvas.toDataURL('image/png');
    onLockAndAnalyze(dataUrl);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* 800x800 Locked Viewport */}
      <div className="relative w-[800px] h-[800px] border-2 border-slate-800 rounded-xl overflow-hidden bg-black shadow-2xl flex-shrink-0">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          className="w-[800px] h-[800px] block"
        />

        {/* Outline stays inside this 800x800 box */}
        {showOutline && <CephOutline strokeColor="#38bdf8" strokeWidth={2} />}
      </div>

      {/* Control Panel */}
      <div className="w-[800px] bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-xs text-slate-300">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>Scale: {scale.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>Horizontal Shift (X): {shiftX}px</span>
            </div>
            <input
              type="range"
              min="-400"
              max="400"
              step="1"
              value={shiftX}
              onChange={(e) => setShiftX(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>Rotation: {rotation}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1">
              <span>Vertical Shift (Y): {shiftY}px</span>
            </div>
            <input
              type="range"
              min="-400"
              max="400"
              step="1"
              value={shiftY}
              onChange={(e) => setShiftY(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between font-medium mb-1">
            <span>Contrast Boost: {contrast}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="250"
            step="5"
            value={contrast}
            onChange={(e) => setContrast(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-400">
            <input
              type="checkbox"
              checked={showOutline}
              onChange={(e) => setShowOutline(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span>Show Outline Guide</span>
          </label>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setFlipped(!flipped)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 font-semibold transition"
            >
              Flip Horizontal
            </button>
            <button
              type="button"
              onClick={handleLockAndExport}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg transition"
            >
              Lock & Analyze →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}