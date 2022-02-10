import './style.css'

import * as THREE from 'three';

// Para poder moverse con el ratón 
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


// 1: Escena (Contenedor de luces y objetos)
const scene = new THREE.Scene();

// 2: Cámara (Campo de visión + Ratio + Foco de visión)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
// Mover la cámara por el eje Z
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene,camera);

// Objetos

  // 1: Geometría
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  // 2: Material (textura) // Material básico no necesita fuente de luz para verse
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347});
  // 3: Combinar geometría y material
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Luces

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

// Herramientas para visualizar mejor luces y grid
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);

scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

// Añadir estrellas
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  // Generar aleatoriamente posiciones para las estrellas
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);

  scene.add(star);
}

// Cuántas estrellas queremos
Array(200).fill(). forEach(addStar);

// Añadir un background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Texture Mapping

const roscoTexture = new THREE.TextureLoader().load('rosco.jpg');

const rosco = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({ map: roscoTexture})
);

rosco.position.z = -5;
rosco.position.x = 2;

scene.add(rosco);

// Luna
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normalmap.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial( {
    map:moonTexture,
    normalMap:normalTexture
  })
);

scene.add(moon); 

moon.position.z = 30;
moon.position.setX(8);

// Función para mover cámara con el scroll
function moveCamera() {

  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  rosco.rotation.y += 0.01;
  rosco.rotation.z += 0.01;

  camera.position.z = t* -0.01;
  camera.position.x = t* -0.0002;
  camera.position.y = t* -0.0002;

}

document.body.onscroll = moveCamera;

// Función para el renderizado automático (game loop)

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  controls.update();
  renderer.render(scene, camera);
}

animate();