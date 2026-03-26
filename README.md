# ⬡ 3D Model Viewer

> A professional, browser-based 3D model viewer built with **Three.js**. Load GLTF/GLB files locally — no server required.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?logo=github)](https://trambak001.github.io/3d-model-viewer/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Three.js](https://img.shields.io/badge/Three.js-r156-orange)](https://threejs.org)

---

## ✨ Features

| Feature | Detail |
|---|---|
| 🗂 File loading | Drag-and-drop **or** file picker for `.glb` / `.gltf` |
| 🔄 Orbit controls | Rotate, pan and zoom with mouse or touch |
| 📐 Auto-fit camera | Camera frames the model automatically on load |
| 💡 Lighting rig | Hemisphere + directional + ambient lights |
| 📊 Model info panel | Mesh count, vertex count, triangle count, material count |
| ⏳ Loading overlay | Spinner with file-read progress percentage |
| ⚠️ Error handling | User-friendly messages for invalid format / oversized files |
| 📱 Mobile responsive | Fluid grid layout works on phones and tablets |
| ♿ Accessibility | Semantic HTML, ARIA labels, keyboard focus styles |
| 🚀 Zero dependencies | Pure HTML/CSS/JS — deploy anywhere, no build step |

---

## 🖥 Live Demo

**[https://trambak001.github.io/3d-model-viewer/](https://trambak001.github.io/3d-model-viewer/)**

---

## 🚀 Getting Started

### Option 1 — Open directly (no server needed)

```bash
git clone https://github.com/trambak001/3d-model-viewer.git
cd 3d-model-viewer
# Open index.html in your browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

> **Note:** Some browsers restrict `FileReader` when opening a file directly from disk.  
> If drag-and-drop does not work, use Option 2 below.

### Option 2 — Local dev server (recommended)

```bash
# Using Node.js / npx
npx serve .

# Using Python 3
python3 -m http.server 8080

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

Then navigate to `http://localhost:8080` (or the port shown in your terminal).

---

## 📂 Project Structure

```
3d-model-viewer/
├── index.html          # Main HTML — semantic structure, ARIA labels
├── main.js             # Three.js scene, loader, camera, UI logic
├── style.css           # Responsive dark-theme styles
├── .gitignore
├── package.json        # Optional dev-server metadata
├── LICENSE
├── CONTRIBUTING.md
└── FEATURES.md
```

---

## 🎮 Usage

1. **Open** the app in your browser.
2. **Drop** a `.glb` or `.gltf` file onto the upload area, or click **Choose File**.
3. The model loads automatically. Use:
   - **Left-click drag** — Rotate
   - **Right-click drag** — Pan
   - **Scroll wheel / pinch** — Zoom
4. View geometry stats in the **Model Info** panel.
5. Click **↺ Reset Camera** to reframe the model.

---

## 📦 Supported Formats

| Format | Extension | Notes |
|---|---|---|
| GL Transmission Format Binary | `.glb` | Single-file binary bundle — recommended |
| GL Transmission Format | `.gltf` | JSON + separate asset files |

> OBJ, FBX, STL and other formats are **not** currently supported.  
> Maximum upload size: **50 MB**.

---

## 🛠 Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| [Three.js](https://threejs.org) | r156 | 3D rendering engine |
| `THREE.OrbitControls` | r156 | Camera navigation |
| `THREE.GLTFLoader` | r156 | GLTF/GLB parsing |
| HTML5 `FileReader` API | — | Local file access |
| CSS Grid / Custom Properties | — | Responsive layout |

---

## ⚙️ Configuration

All tunable constants are at the top of `main.js`:

```js
/** Maximum allowed upload size in bytes (50 MB). */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** Accepted file extensions. */
const ACCEPTED_EXTENSIONS = new Set(['.glb', '.gltf']);
```

To change the background colour, edit `init()`:

```js
scene.background = new THREE.Color(0x1a1d21); // any hex value
```

---

## 🐛 Troubleshooting

| Symptom | Fix |
|---|---|
| Blank canvas / nothing renders | Check the browser console for WebGL errors; try a different browser |
| "Unsupported format" error | Ensure your file ends in `.glb` or `.gltf` |
| "File is too large" error | Compress the model or increase `MAX_FILE_SIZE` in `main.js` |
| Model appears black | The model may lack normals; open it in [Blender](https://www.blender.org) and recalculate normals |
| Controls feel sluggish | Reduce `controls.dampingFactor` in `init()` |

---

## 🏎 Performance Tips

- Prefer **GLB** over GLTF (single binary file, faster to read).
- Reduce polygon count with [Blender's Decimate modifier](https://docs.blender.org/manual/en/latest/modeling/modifiers/generate/decimate.html) before uploading.
- Compress textures to JPEG and resize to power-of-two dimensions.
- Use [glTF-Transform](https://gltf-transform.donmccurdy.com/) to further optimise your models.

---

## 🗺 Roadmap

- [ ] OBJ / FBX / STL loader support
- [ ] Environment map / HDRI lighting
- [ ] Screenshot / export button
- [ ] Animation playback (morph targets, skeletal)
- [ ] Wireframe toggle
- [ ] Measurement tool
- [ ] VR / AR mode via WebXR

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.
