// SECTION: Constants - mock seasonal data
const SEASONS = {
  Spring: {
    tagline: "Warm, clear and light – fresh, bright tones bring you to life.",
    wear: [
      { name: "Warm Coral", hex: "#ff7c6b", note: "Lively and bright" },
      { name: "Buttercream", hex: "#ffe8b3", note: "Soft light neutral" },
      { name: "Fresh Aqua", hex: "#4fd1c5", note: "Clear, playful" },
      { name: "Apple Green", hex: "#8fdc6c", note: "Crisp and warm" },
      { name: "Apricot", hex: "#ffb482", note: "Glowing warmth" },
      { name: "Warm Navy", hex: "#264477", note: "Gentle contrast" }
    ],
    avoid: [
      { name: "Dusty Mauve", hex: "#9b7597", note: "Too muted/cool" },
      { name: "Charcoal", hex: "#374151", note: "Overpowers" },
      { name: "Icy Pink", hex: "#f9d7ff", note: "Too cool" },
      { name: "Burgundy", hex: "#581c2b", note: "Too heavy" },
      { name: "Slate Blue", hex: "#64748b", note: "Greyed down" },
      { name: "Ash Brown", hex: "#4b5563", note: "Drains warmth" }
    ]
  },
  Summer: {
    tagline: "Cool, soft and romantic – muted pastels and refined tones suit you best.",
    wear: [
      { name: "Rosewood", hex: "#c27c9b", note: "Soft and cool" },
      { name: "French Navy", hex: "#1c2f4a", note: "Elegant neutral" },
      { name: "Shell Pink", hex: "#f7c6d6", note: "Gentle blush" },
      { name: "Misty Blue", hex: "#9fb6d7", note: "Powdery cool" },
      { name: "Seafoam", hex: "#9ad1c4", note: "Quiet freshness" },
      { name: "Soft Plum", hex: "#8b6c94", note: "Sophisticated depth" }
    ],
    avoid: [
      { name: "Tomato Red", hex: "#f44336", note: "Too hot" },
      { name: "Golden Orange", hex: "#ff9800", note: "Too warm" },
      { name: "Sharp Lime", hex: "#d4f30b", note: "Too acidic" },
      { name: "Black", hex: "#000000", note: "Harsh contrast" },
      { name: "Neon Pink", hex: "#ff3fb4", note: "Too intense" },
      { name: "Warm Camel", hex: "#b58b58", note: "Too yellow" }
    ]
  },
  Autumn: {
    tagline: "Rich, warm and earthy – deep golden tones echo your natural warmth.",
    wear: [
      { name: "Burnt Sienna", hex: "#c46a3d", note: "Glowing warmth" },
      { name: "Olive Green", hex: "#7a8b3a", note: "Earthy neutral" },
      { name: "Mustard", hex: "#d89c25", note: "Golden highlight" },
      { name: "Teal", hex: "#1c7a7f", note: "Rich contrast" },
      { name: "Terracotta", hex: "#cc5b3f", note: "Soft depth" },
      { name: "Chocolate Brown", hex: "#4b2e20", note: "Grounding base" }
    ],
    avoid: [
      { name: "Icy Blue", hex: "#c3e3ff", note: "Too cool" },
      { name: "Silver Grey", hex: "#e5e7eb", note: "Washes out" },
      { name: "Magenta", hex: "#d81b60", note: "Too cool/clear" },
      { name: "True Black", hex: "#000000", note: "Too severe" },
      { name: "Lilac", hex: "#d9c2ff", note: "Too cool" },
      { name: "Bubblegum Pink", hex: "#ff7bbf", note: "Too sugary" }
    ]
  },
  Winter: {
    tagline: "Cool, clear and dramatic – crisp, high-contrast hues mirror your intensity.",
    wear: [
      { name: "True Black", hex: "#000000", note: "Signature neutral" },
      { name: "Optic White", hex: "#f9fafb", note: "Clean contrast" },
      { name: "Sapphire", hex: "#1749b3", note: "Bold and cool" },
      { name: "Fuchsia", hex: "#d4146b", note: "Electric statement" },
      { name: "Emerald", hex: "#007f5f", note: "Striking jewel" },
      { name: "Cherry Red", hex: "#c8102e", note: "Clear cool red" }
    ],
    avoid: [
      { name: "Camel", hex: "#c19a6b", note: "Too warm" },
      { name: "Rust", hex: "#b7410e", note: "Too muted" },
      { name: "Peach", hex: "#ffcda5", note: "Too soft/warm" },
      { name: "Olive", hex: "#7a8b3a", note: "Drab on you" },
      { name: "Warm Taupe", hex: "#b39b82", note: "Muddy" },
      { name: "Soft Coral", hex: "#ff8b7b", note: "Too gentle" }
    ]
  }
};

// SECTION: DOM Elements
const fileInput = document.getElementById("photo-input");
const openCameraBtn = document.getElementById("open-camera");
const cameraModal = document.getElementById("camera-modal");
const closeCameraBtn = document.getElementById("close-camera");
const stopCameraBtn = document.getElementById("stop-camera");
const capturePhotoBtn = document.getElementById("capture-photo");
const cameraVideo = document.getElementById("camera-video");
const previewImg = document.getElementById("photo-preview");
const previewPlaceholder = document.getElementById("preview-placeholder");
const analyzeButton = document.getElementById("analyze-button");
const analysisStatus = document.getElementById("analysis-status");
const resultsSection = document.getElementById("results");
const seasonNameEl = document.getElementById("season-name");
const seasonTaglineEl = document.getElementById("season-tagline");
const wearSwatchesEl = document.getElementById("wear-swatches");
const avoidSwatchesEl = document.getElementById("avoid-swatches");
const hiddenCanvas = document.getElementById("analysis-canvas");

let cameraStream = null;
let hasImageLoaded = false;

// SECTION: Helpers
function setStatus(message, isLoading = false) {
  if (!analysisStatus) return;
  analysisStatus.textContent = message;
  analysisStatus.dataset.loading = isLoading ? "true" : "false";
}

function showPreview(src) {
  if (!previewImg || !previewPlaceholder) return;
  previewImg.src = src;
  previewImg.style.display = "block";
  previewPlaceholder.style.display = "none";
  hasImageLoaded = true;
  analyzeButton.disabled = false;
}

function openCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Camera access is not supported in this browser. Please upload a photo instead.");
    return;
  }

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "user" } })
    .then((stream) => {
      cameraStream = stream;
      cameraVideo.srcObject = stream;
      cameraModal.setAttribute("aria-hidden", "false");
    })
    .catch(() => {
      alert("Unable to access camera. Please check permissions or upload a photo.");
    });
}

function closeCamera() {
  cameraModal.setAttribute("aria-hidden", "true");
  if (cameraStream) {
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
  }
}

function capturePhoto() {
  if (!cameraStream) return;

  const video = cameraVideo;
  const canvas = hiddenCanvas;
  const context = canvas.getContext("2d");

  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;
  canvas.width = width;
  canvas.height = height;
  context.drawImage(video, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/png");
  showPreview(dataUrl);
  closeCamera();
}

function handleFileChange(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please upload an image file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target && e.target.result;
    if (typeof src === "string") {
      showPreview(src);
    }
  };
  reader.readAsDataURL(file);
}

// SECTION: Mock AI Analysis
function mockAnalyseSeasonFromImage(img) {
  const canvas = hiddenCanvas;
  const ctx = canvas.getContext("2d");
  const size = 80;

  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size).data;
  let total = imageData.length / 4;
  let rSum = 0,
    gSum = 0,
    bSum = 0;

  for (let i = 0; i < imageData.length; i += 4) {
    rSum += imageData[i];
    gSum += imageData[i + 1];
    bSum += imageData[i + 2];
  }

  const rAvg = rSum / total;
  const gAvg = gSum / total;
  const bAvg = bSum / total;

  const brightness = (rAvg + gAvg + bAvg) / (3 * 255);
  const warmth = (rAvg - bAvg) / 255;

  if (brightness > 0.6 && warmth > 0.08) return "Spring";
  if (brightness > 0.6 && warmth <= 0.08) return "Summer";
  if (brightness <= 0.6 && warmth > 0.05) return "Autumn";
  return "Winter";
}

function renderSwatches(container, items) {
  container.innerHTML = "";
  items.forEach((item) => {
    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.background = item.hex;

    const top = document.createElement("div");
    top.className = "swatch-top";
    top.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "swatch-meta";
    meta.textContent = `${item.hex.toUpperCase()} · ${item.note}`;

    swatch.appendChild(top);
    swatch.appendChild(meta);
    container.appendChild(swatch);
  });
}

function runAnalysis() {
  if (!hasImageLoaded) return;
  setStatus("Analysing undertones, depth and contrast…", true);
  analyzeButton.disabled = true;

  const tempImg = new Image();
  tempImg.onload = () => {
    const seasonKey = mockAnalyseSeasonFromImage(tempImg);
    const seasonData = SEASONS[seasonKey];

    seasonNameEl.textContent = seasonKey;
    seasonTaglineEl.textContent = seasonData.tagline;
    renderSwatches(wearSwatchesEl, seasonData.wear);
    renderSwatches(avoidSwatchesEl, seasonData.avoid);

    resultsSection.hidden = false;
    setStatus("Analysis complete. Scroll to explore your palette.");
    analyzeButton.disabled = false;
  };
  tempImg.onerror = () => {
    setStatus("We couldn't read this image. Please try another photo.");
    analyzeButton.disabled = false;
  };
  tempImg.src = previewImg.src;
}

// SECTION: Event handlers
if (fileInput) fileInput.addEventListener("change", handleFileChange);
if (openCameraBtn) openCameraBtn.addEventListener("click", openCamera);
if (closeCameraBtn) closeCameraBtn.addEventListener("click", closeCamera);
if (stopCameraBtn) stopCameraBtn.addEventListener("click", closeCamera);
if (capturePhotoBtn) capturePhotoBtn.addEventListener("click", capturePhoto);
if (analyzeButton) analyzeButton.addEventListener("click", runAnalysis);
