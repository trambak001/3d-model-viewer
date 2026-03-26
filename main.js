/**
 * @fileoverview 3D Model Viewer — main application logic.
 *
 * Initialises a Three.js scene, handles GLTF/GLB file loading via the
 * FileReader API, provides drag-and-drop support, displays a loading overlay
 * during parsing, auto-fits the camera to the loaded model, and shows a
 * detailed info panel with geometry statistics.
 *
 * Dependencies (loaded via CDN in index.html):
 *   - Three.js  r156
 *   - THREE.OrbitControls
 *   - THREE.GLTFLoader
 */

/* ─── Constants ────────────────────────────────────────────────────────────── */

/** Maximum allowed upload size in bytes (50 MB). */
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/** Accepted MIME / extension map for quick validation. */
const ACCEPTED_EXTENSIONS = new Set(['.glb', '.gltf']);

/* ─── Module-level state ────────────────────────────────────────────────────── */

/** @type {THREE.Scene} */
let scene;

/** @type {THREE.PerspectiveCamera} */
let camera;

/** @type {THREE.WebGLRenderer} */
let renderer;

/** @type {THREE.OrbitControls} */
let controls;

/** @type {THREE.Group|null} Currently loaded model root. */
let model = null;

/* ─── Initialisation ────────────────────────────────────────────────────────── */

/**
 * Initialise the Three.js scene, camera, renderer, lights and orbit controls.
 * Called once the DOM is ready.
 */
function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1d21);

  // Camera
  const container = document.getElementById('viewer-container');
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.01, 2000);
  camera.position.set(0, 2, 5);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(5, 10, 7.5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);

  // Ambient fill
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // Grid helper
  const grid = new THREE.GridHelper(10, 20, 0x444444, 0x333333);
  scene.add(grid);

  // Orbit controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 0.1;
  controls.maxDistance = 500;
  controls.enablePan = true;

  // Resize handling
  window.addEventListener('resize', onWindowResize);

  // Start render loop
  animate();
}

/* ─── Render loop ───────────────────────────────────────────────────────────── */

/**
 * The main animation / render loop. Called every frame via
 * requestAnimationFrame.
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

/* ─── Window resize ─────────────────────────────────────────────────────────── */

/**
 * Update camera aspect ratio and renderer size whenever the browser window
 * is resized.
 */
function onWindowResize() {
  const container = document.getElementById('viewer-container');
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

/* ─── Model loading ─────────────────────────────────────────────────────────── */

/**
 * Validate, read and load a GLTF/GLB file from a File object.
 *
 * @param {File} file - The file selected by the user.
 */
function loadModel(file) {
  // ── 1. File validation ──────────────────────────────────────────────────────
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ACCEPTED_EXTENSIONS.has(ext)) {
    showError('Unsupported format "' + ext + '". Please upload a .glb or .gltf file.');
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    showError(
      'File is too large (' + formatBytes(file.size) + '). Maximum allowed size is ' +
      formatBytes(MAX_FILE_SIZE) + '.'
    );
    return;
  }

  // ── 2. Clear previous model ──────────────────────────────────────────────────
  if (model) {
    scene.remove(model);
    model = null;
  }
  hideInfoPanel();
  hideError();

  // ── 3. Show loading overlay ──────────────────────────────────────────────────
  showLoading('Reading file…');

  // ── 4. Read file buffer ──────────────────────────────────────────────────────
  const reader = new FileReader();

  reader.onprogress = function (e) {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 100);
      updateLoadingDetail('Reading… ' + pct + '%');
    }
  };

  reader.onerror = function () {
    hideLoading();
    showError('Failed to read the file. Please try again.');
  };

  reader.onload = function (e) {
    updateLoadingDetail('Parsing model…');

    const loader = new THREE.GLTFLoader();
    loader.parse(
      e.target.result,
      '',
      function (gltf) {
        onModelLoaded(gltf, file);
      },
      function (parseError) {
        hideLoading();
        showError('Failed to parse model: ' + (parseError.message || parseError));
      }
    );
  };

  reader.readAsArrayBuffer(file);
}

/**
 * Called when the GLTF loader successfully parses a model.  Adds the model to
 * the scene, auto-fits the camera, and populates the info panel.
 *
 * @param {object} gltf    - The parsed GLTF object returned by GLTFLoader.
 * @param {File}   file    - The original File object (used for metadata).
 */
function onModelLoaded(gltf, file) {
  model = gltf.scene;
  scene.add(model);

  // Auto-fit camera to model bounding sphere
  fitCameraToModel(model);

  // Collect geometry statistics
  const stats = collectStats(model);

  // Populate info panel
  document.getElementById('info-filename').textContent = file.name;
  document.getElementById('info-filesize').textContent = formatBytes(file.size);
  document.getElementById('info-meshes').textContent = stats.meshes.toLocaleString();
  document.getElementById('info-vertices').textContent = stats.vertices.toLocaleString();
  document.getElementById('info-triangles').textContent = stats.triangles.toLocaleString();
  document.getElementById('info-materials').textContent = stats.materials.toLocaleString();

  showInfoPanel();
  hideLoading();

  console.log('[3D Viewer] Model loaded:', file.name, stats);
}

/* ─── Camera helpers ─────────────────────────────────────────────────────────── */

/**
 * Fit the camera and orbit-controls target to encompass the entire model.
 *
 * @param {THREE.Object3D} object - The root object to fit.
 */
function fitCameraToModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.5;

  camera.position.set(center.x, center.y + size.y * 0.25, center.z + distance);
  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.maxDistance = distance * 10;
  controls.update();
}

/**
 * Reset the camera to the default position for the current model.
 * Exposed via the "Reset Camera" button in the info panel.
 */
function resetCamera() {
  if (model) {
    fitCameraToModel(model);
  } else {
    camera.position.set(0, 2, 5);
    controls.target.set(0, 0, 0);
    controls.update();
  }
}

/* ─── Geometry statistics ────────────────────────────────────────────────────── */

/**
 * Traverse the scene graph and count meshes, vertices, triangles and unique
 * materials.
 *
 * @param {THREE.Object3D} root - Root object to inspect.
 * @returns {{ meshes: number, vertices: number, triangles: number, materials: number }}
 */
function collectStats(root) {
  let meshes = 0;
  let vertices = 0;
  let triangles = 0;
  const materialSet = new Set();

  root.traverse(function (obj) {
    if (obj.isMesh) {
      meshes++;
      const geo = obj.geometry;
      if (geo) {
        if (geo.attributes.position) {
          vertices += geo.attributes.position.count;
        }
        if (geo.index) {
          triangles += geo.index.count / 3;
        } else if (geo.attributes.position) {
          triangles += geo.attributes.position.count / 3;
        }
      }
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(function (m) { materialSet.add(m.uuid); });
      }
    }
  });

  return {
    meshes,
    vertices: Math.round(vertices),
    triangles: Math.round(triangles),
    materials: materialSet.size
  };
}

/* ─── UI helpers ─────────────────────────────────────────────────────────────── */

/**
 * Show the loading overlay with an optional message.
 *
 * @param {string} [message] - Text to show inside the overlay.
 */
function showLoading(message) {
  const overlay = document.getElementById('loading-overlay');
  const detail = document.getElementById('loading-detail');
  if (message) detail.textContent = message;
  overlay.hidden = false;
}

/**
 * Update the secondary detail line inside the loading overlay.
 *
 * @param {string} detail - Detail text.
 */
function updateLoadingDetail(detail) {
  document.getElementById('loading-detail').textContent = detail;
}

/** Hide the loading overlay. */
function hideLoading() {
  document.getElementById('loading-overlay').hidden = true;
}

/**
 * Display an error message in the error banner.
 *
 * @param {string} message - Human-readable error description.
 */
function showError(message) {
  const banner = document.getElementById('error-message');
  document.getElementById('error-text').textContent = message;
  banner.hidden = false;
}

/** Hide the error banner. */
function hideError() {
  document.getElementById('error-message').hidden = true;
}

/** Show the model info panel. */
function showInfoPanel() {
  document.getElementById('info-panel').hidden = false;
}

/** Hide the model info panel. */
function hideInfoPanel() {
  document.getElementById('info-panel').hidden = true;
}

/* ─── Utility ────────────────────────────────────────────────────────────────── */

/**
 * Format a byte count into a human-readable string (B, KB, MB, GB).
 *
 * @param {number} bytes - Raw byte count.
 * @returns {string} Formatted string, e.g. "4.2 MB".
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/* ─── Drag-and-drop support ──────────────────────────────────────────────────── */

/**
 * Attach drag-and-drop event listeners to the upload area.
 */
function initDragAndDrop() {
  const uploadArea = document.getElementById('upload-area');

  uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', function () {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) loadModel(file);
  });
}

/* ─── Event listeners ────────────────────────────────────────────────────────── */

document.getElementById('model-upload').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) loadModel(file);
  // Reset the input so the same file can be re-selected
  event.target.value = '';
});

document.getElementById('error-close').addEventListener('click', hideError);

document.getElementById('reset-camera').addEventListener('click', resetCamera);

/* ─── Bootstrap ──────────────────────────────────────────────────────────────── */

window.addEventListener('DOMContentLoaded', function () {
  // Guard: check for WebGL support
  if (!window.WebGLRenderingContext) {
    showError(
      'Your browser does not support WebGL. Please use a modern browser such as ' +
      'Chrome, Firefox, Edge or Safari.'
    );
    return;
  }

  init();
  initDragAndDrop();
});
