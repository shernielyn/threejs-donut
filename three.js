import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'lil-gui';

/** 
 * Setup Scene, Camera, and Renderer 
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

/** 
 * Handle Resizing and Fullscreen 
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener('dblclick', () => {
  if (!document.fullscreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

/** 
 * Add Lighting 
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/** 
 * Load Textures 
 */
const textureLoader = new THREE.TextureLoader();
const doorTexture = textureLoader.load('/textures/door/color.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

/** 
 * Create Geometries and Materials 
 */
const materialBasic = new THREE.MeshBasicMaterial({ map: doorTexture });
const materialMatcap = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
const materialStandard = new THREE.MeshStandardMaterial({ metalness: 0.5, roughness: 0.5 });

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), materialBasic);
sphere.position.x = -1.5;
scene.add(sphere);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), materialStandard);
scene.add(plane);

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 128), materialMatcap);
torus.position.x = 1.5;
scene.add(torus);

/** 
 * Debug UI 
 */
const gui = new dat.GUI();
const materialFolder = gui.addFolder('Material Properties');
materialFolder.add(materialStandard, 'metalness').min(0).max(1).step(0.01);
materialFolder.add(materialStandard, 'roughness').min(0).max(1).step(0.01);

/** 
 * Add Orbit Controls 
 */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/** 
 * Animation Loop 
 */
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();

  // Rotate objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

