import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";


const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 10;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Vibrant Blue Saturn (Adjusted Position)
const saturnGeometry = new THREE.SphereGeometry(2, 32, 32);
const saturnMaterial = new THREE.MeshStandardMaterial({
    color: 0x007bff, // Vibrant blue
    roughness: 0.7,
    metalness: 0.1,
});
const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
// Move Saturn to the center of the scene and tilt it horizontally
saturnMesh.position.set(0, -2, 0); 
saturnMesh.rotation.x = -Math.PI / 2; // Rotate 90 degrees on the X-axis
scene.add(saturnMesh);


// Scattered Vibrant Blue Dust Ring (Adjusted for Horizontal Saturn)
function createRing(radius, numParticles, opacity) {
    const ringGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
        const r = radius + Math.random() * 0.3;
        const angle = Math.random() * Math.PI * 2;
        const x = r * Math.cos(angle);
        const y = -2;
        const z = r * Math.sin(angle);

        positions.set([x, y, z], i * 3);
        const color = new THREE.Color(0x007bff);
        color.setHSL(0.6, 1, 0.5);
        colors.set(color.toArray(), i * 3);
    }

    ringGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    ringGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const ringMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: opacity,
    });

    return new THREE.Points(ringGeometry, ringMaterial);
}

const ring1 = createRing(2.3, 5000, 0.8);
const ring2 = createRing(2.8, 3000, 0.6); // Added ring
const ring3 = createRing(3.3, 2000, 0.4); // Added ring
const ring4 = createRing(3.8, 1500, 0.2); // Added ring
const ring5 = createRing(4.3, 1000, 0.1); // Added ring
const ring6 = createRing(4.8, 500, 0.05); // Added ring

scene.add(ring1);
scene.add(ring2);
scene.add(ring3);
scene.add(ring4);
scene.add(ring5);
scene.add(ring6);
// White Moons
const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32); // Larger moons
const numMoons = 3;
const moons = [];
const moonOrbitalPeriods = [10, 20, 30];
const moonOrbitalRadii = [4, 5, 6];

for (let i = 0; i < numMoons; i++) {
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff, // White
        emissive: 0xffffff, // Emissive for brightness
        emissiveIntensity: 0.8, // Increased intensity for brighter moons
        roughness: 0.2,
        metalness: 0.2,
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moons.push(moon);
    scene.add(moon);
}

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Increased intensity
directionalLight.position.set(2, 5, 3);
scene.add(directionalLight);

const spotLight = new THREE.SpotLight(0xffd700, 0.7);
spotLight.position.set(-5, 5, -5);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.5;
scene.add(spotLight);

const ambientLight = new THREE.AmbientLight(0x444444); // Brighter ambient light
scene.add(ambientLight);


// Vibrant Stars (Golden Yellow and White)
const numStars = 1000;
const starsGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(numStars * 3);
const starColors = new Float32Array(numStars * 3);

for (let i = 0; i < numStars; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;

    starPositions.set([x, y, z], i * 3);

    // Randomly choose golden yellow or white color, with more saturation
    const color = Math.random() < 0.5 ? 0xffff00 : 0xffffff;
    const hue = color === 0xffff00 ? 0.15 : 0; // Adjust hue for golden yellow
    const saturation = 1; // Full saturation
    const lightness = 0.8; // Adjust lightness for brightness
    const starColor = new THREE.Color();
    starColor.setHSL(hue, saturation, lightness);
    starColors.set(starColor.toArray(), i * 3);
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

const starMaterial = new THREE.PointsMaterial({
    size: 0.2, // Increased size
    vertexColors: true,
    transparent: true,
    opacity: 0.9, // Increased opacity
});

const starField = new THREE.Points(starsGeometry, starMaterial);
scene.add(starField);

// Gradient Colored Spiral Galaxy
// Function to create a spiral galaxy

function createSpiralGalaxy(radius, numParticles, yPosition, rotationSpeed) {
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyVertices = [];
    const galaxyColors = [];
    const branches = 3;
    const spinFactor = 1.5;
    const randomness = 0.5;
    const randomPower = 2;

    const insideColor = new THREE.Color('#FF6030');
    const outsideColor = new THREE.Color('#7138E4');

    for (let i = 0; i < numParticles; i++) {
        const r = Math.random() * radius;
        const branchAngle = ((i % branches) / branches) * Math.PI * 2;
        const spinAngle = r * spinFactor;
        const randomX = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * randomness;
        const randomY = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * 0.2;
        const randomZ = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5 ? 1 : -1) * randomness;

        const x = Math.cos(branchAngle + spinAngle) * r + randomX;
        const y = yPosition + randomY;
        const z = Math.sin(branchAngle + spinAngle) * r + randomZ;

        galaxyVertices.push(x, y, z);

        const color = insideColor.clone();
        color.lerp(outsideColor, r / radius);
        galaxyColors.push(color.r, color.g, color.b);
    }

    galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(galaxyVertices, 3));
    galaxyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(galaxyColors, 3));

    const galaxyMaterial = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
    });

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    galaxy.rotationSpeed = rotationSpeed; // Add rotation speed property
    return galaxy;
}

// Create multiple galaxies around Saturn - scattered
const numGalaxies = 20; // Increased number of galaxies for better scattering
const galaxyRadius = 15; // Reduced radius for better scattering
const galaxySpacing = 200; // Increased spacing for better scattering

const galaxies = [];
for (let i = 0; i < numGalaxies; i++) {
    const x = (Math.random() - 0.5) * galaxySpacing;
    const y = (Math.random() - 0.5) * galaxySpacing-6; // scattering the galaxies on the y axis
    const z = (Math.random() - 0.5) * galaxySpacing;
    const galaxy = createSpiralGalaxy(galaxyRadius, 10000, y, 0.001 + Math.random() * 0.001); // Vary rotation speed
    galaxy.position.set(x, y, z);
    galaxies.push(galaxy);
    scene.add(galaxy);
}


// Animation
let galaxyRotation = 0;
function animate(time) {
    requestAnimationFrame(animate);
    const t = time / 1000;

    // Moon animation
    for (let i = 0; i < numMoons; i++) {
        const angle = 2 * Math.PI * (t / moonOrbitalPeriods[i]);
        const x = moonOrbitalRadii[i] * Math.cos(angle);
        const z = moonOrbitalRadii[i] * Math.sin(angle);
        moons[i].position.set(x, 0, z);
    }

    // Galaxy rotation
    galaxies.forEach(galaxy => {
        galaxy.rotation.y += galaxy.rotationSpeed;
    });

    saturnMesh.rotation.y = t * 0.0001;
    renderer.render(scene, camera);
    controls.update();
}

animate();