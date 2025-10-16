let scene, camera, renderer, controls, model;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222931);

  camera = new THREE.PerspectiveCamera(75, 0.8 * window.innerWidth / (0.6 * window.innerHeight), 0.1, 1000);
  camera.position.set(0, 2, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(0.8 * window.innerWidth, 0.6 * window.innerHeight);

  document.getElementById('viewer-container').appendChild(renderer.domElement);

  // Add lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2);
  scene.add(hemiLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Load 3D model
function loadModel(file) {
  if (model) {
    scene.remove(model);
  }
  const loader = new THREE.GLTFLoader();
  const reader = new FileReader();
  reader.onload = function (e) {
    loader.parse(e.target.result, '', function (gltf) {
      model = gltf.scene;
      scene.add(model);
    },
    function (error) {
      alert('Model load error: ' + error);
    });
  };
  reader.readAsArrayBuffer(file);
}

document.getElementById('model-upload').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) loadModel(file);
});

window.addEventListener('DOMContentLoaded', init);
