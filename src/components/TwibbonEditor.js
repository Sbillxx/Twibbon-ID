import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import "./TwibbonEditor.css";
import { createImage } from "./utils";

const getCroppedImg = async (imageSrc, cropPixels) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = cropPixels.width;
  canvas.height = cropPixels.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height, 0, 0, cropPixels.width, cropPixels.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
};

const TwibbonEditor = ({ twibbonSrc }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [aspectRatio, setAspectRatio] = useState(1);
  const [frameDimensions, setFrameDimensions] = useState({ width: 1080, height: 1080 });
  const [initialZoom, setInitialZoom] = useState(1);

  // Detect aspect ratio of twibbon frame
  useEffect(() => {
    const detectAspectRatio = () => {
      const img = new Image();
      img.onload = () => {
        setAspectRatio(img.width / img.height);
        setFrameDimensions({ width: img.width, height: img.height });
      };
      img.src = twibbonSrc;
    };

    if (twibbonSrc) detectAspectRatio();
  }, [twibbonSrc]);

  // Auto-center and auto-fit crop area when image uploaded or aspect ratio changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new window.Image();
    img.onload = () => {
      // Universal COVER: gambar selalu nutupin cropper (full grid)
      const minZoom = Math.max(frameDimensions.width / img.width, frameDimensions.height / img.height);
      setZoom(minZoom);
      setCrop({ x: 0, y: 0 }); // center
    };
    img.src = imageSrc;
  }, [imageSrc, aspectRatio, frameDimensions]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsLoading(true);
    try {
      // 1. Buat canvas dengan ukuran frame asli
      const canvas = document.createElement("canvas");
      canvas.width = frameDimensions.width;
      canvas.height = frameDimensions.height;
      const ctx = canvas.getContext("2d");

      // 2. Ambil gambar user
      const image = await createImage(imageSrc);

      // 3. Crop bagian yang dipilih user, lalu gambar ke canvas dengan skala penuh
      ctx.drawImage(image, Math.round(croppedAreaPixels.x), Math.round(croppedAreaPixels.y), Math.round(croppedAreaPixels.width), Math.round(croppedAreaPixels.height), 0, 0, canvas.width, canvas.height);

      // 4. Overlay twibbon frame
      const frameImg = await createImage(twibbonSrc);
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

      // 5. Download
      const link = document.createElement("a");
      link.download = "twibbon-final.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Success animation
      const button = document.querySelector(".download-button");
      if (button) {
        button.classList.add("success-animation");
        setTimeout(() => button.classList.remove("success-animation"), 600);
      }
    } catch (error) {
      console.error("Error generating twibbon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get aspect ratio label for display
  const getAspectRatioLabel = () => {
    if (Math.abs(aspectRatio - 1) < 0.1) return "1:1 (Square)";
    if (Math.abs(aspectRatio - 4 / 3) < 0.1) return "9:16 (Mobile)";
    if (Math.abs(aspectRatio - 16 / 9) < 0.1) return "9:16 (Mobile)";
    if (Math.abs(aspectRatio - 3 / 4) < 0.1) return "9:16 (Mobile)";
    if (Math.abs(aspectRatio - 9 / 16) < 0.1) return "9:16 (Mobile)";
    return `${aspectRatio.toFixed(2)}:1 (Custom)`;
  };

  return (
    <div className="editor-container">
      <div className="upload-section">
        <h2 className="upload-title">🎨 Twibbon Editor</h2>
        <div className="frame-info">
          <span className="frame-dimensions">
            📐 Frame: {frameDimensions.width}×{frameDimensions.height} ({getAspectRatioLabel()})
          </span>
        </div>
        <div className="file-upload-wrapper">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="file-upload-input" id="file-upload" />
          <label htmlFor="file-upload" className="file-upload-button">
            <span className="file-upload-icon">📷</span>
            Choose your photo
          </label>
        </div>
        {fileName && (
          <div className="selected-photo-box">
            <span className="file-upload-icon">📁</span>
            Selected: {fileName}
          </div>
        )}
      </div>

      {imageSrc && (
        <div
          className="crop-container"
          style={{
            aspectRatio: aspectRatio,
            maxHeight: aspectRatio > 1 ? "400px" : "500px",
            maxWidth: aspectRatio < 1 ? "300px" : "400px",
          }}
        >
          <Cropper image={imageSrc} crop={crop} zoom={zoom} aspect={aspectRatio} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} showGrid={true} />
          <img src={twibbonSrc} alt="twibbon" className="twibbon-overlay" />
        </div>
      )}

      <div className="controls">
        {imageSrc && (
          <div className="zoom-control">
            <label className="zoom-label">🔍 Zoom: {zoom.toFixed(1)}x</label>
            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="zoom-slider" />
          </div>
        )}

        <button onClick={handleDownload} disabled={!imageSrc || !croppedAreaPixels || isLoading} className="download-button">
          {isLoading ? (
            <>
              <span className="loading"></span>
              Processing...
            </>
          ) : (
            <>💾 Download Twibbon</>
          )}
        </button>
      </div>
    </div>
  );
};

export default TwibbonEditor;
