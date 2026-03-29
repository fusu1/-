/**
 * 3D WebGL Background using Three.js
 * Cyd Stumpel inspired: Organic, glass-like, floating 3D objects with physical materials
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded.');
        return;
    }

    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Move camera back to see the objects
    camera.position.z = 15;

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,           // Transparent background
        antialias: true        // Smooth edges
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Lights ---
    // Increase ambient light to make shapes more visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Directional light 1 (Main light)
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    // Directional light 2 (Fill light, bluish)
    const dirLight2 = new THREE.DirectionalLight(0x8ebafc, 1.5);
    dirLight2.position.set(-5, 0, 2);
    scene.add(dirLight2);

    // Point light (Pinkish tone)
    const pointLight = new THREE.PointLight(0xffbce0, 2.5, 50);
    pointLight.position.set(0, -2, 4);
    scene.add(pointLight);

    // --- Materials ---
    /**
     * To ensure visibility on both light and dark backgrounds:
     * We decrease transmission, increase metalness, and give them a distinct tint.
     */
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4a8cdb,        // Deep blue tint for visibility
        metalness: 0.4,         // More metallic reflection
        roughness: 0.15,
        transmission: 0.5,      // Less transparent so it doesn't wash out in light mode
        opacity: 1,
        transparent: true,
        thickness: 1.5,
        ior: 1.6,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const glassMaterialDark = new THREE.MeshPhysicalMaterial({
        color: 0x9b59b6,        // Deep purple tint
        metalness: 0.5,
        roughness: 0.2,
        transmission: 0.4,
        opacity: 1,
        transparent: true,
        thickness: 1.0,
        ior: 1.5,
        clearcoat: 1.0
    });

    const glassMaterialCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00d2ff,        // Vibrant cyan tint
        metalness: 0.3,
        roughness: 0.1,
        transmission: 0.6,
        transparent: true,
        thickness: 0.8,
        ior: 1.4,
        clearcoat: 1.0
    });

    // Theme Switcher Logic for Materials
    function updateMaterialColors() {
        const isDark = document.body.classList.contains('dark-mode');
        if (isDark) {
            // Brighten up colors for dark mode
            glassMaterial.color.setHex(0x99ccff);
            glassMaterialDark.color.setHex(0xd0a1ff);
            glassMaterialCyan.color.setHex(0x88eeff);
            ambientLight.intensity = 0.8; // dim lights a bit in dark mode to keep it moody
        } else {
            // Darker, more saturated colors for light mode to maintain contrast
            glassMaterial.color.setHex(0x2a5ca8);
            glassMaterialDark.color.setHex(0x7030a0);
            glassMaterialCyan.color.setHex(0x0088aa);
            ambientLight.intensity = 1.2;
        }
    }

    // Observe body class changes to toggle 3D material colors
    const observer = new MutationObserver(updateMaterialColors);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    // Initial color setup
    updateMaterialColors();

    // --- Geometries & Meshes ---
    const objects = [];

    // Calculate positions to place items strictly on the left and right gutters
    // Depending on aspect ratio, X = ±7 to ±9 is usually outside the center 1000px container
    const leftX = window.innerWidth > 1400 ? -8 : -5.5;
    const rightX = window.innerWidth > 1400 ? 8 : 5.5;
    const innerLeftX = leftX + 1.5;
    const innerRightX = rightX - 1.5;

    // 1. Top Left: Icosahedron
    const geo1 = new THREE.IcosahedronGeometry(1.2, 0);
    const mesh1 = new THREE.Mesh(geo1, glassMaterial);
    mesh1.position.set(leftX, 4, -1);
    scene.add(mesh1);
    objects.push({ mesh: mesh1, rotSpeedX: 0.005, rotSpeedY: 0.007 });

    // 2. Top Right: TorusKnot
    const geo2 = new THREE.TorusKnotGeometry(1.0, 0.3, 100, 16);
    const mesh2 = new THREE.Mesh(geo2, glassMaterialDark);
    mesh2.position.set(rightX, 3.5, -2);
    scene.add(mesh2);
    objects.push({ mesh: mesh2, rotSpeedX: 0.003, rotSpeedY: 0.004 });

    // 3. Middle Left: Breathing Sphere (Organic)
    const geo3 = new THREE.SphereGeometry(1.5, 64, 64);
    const mesh3 = new THREE.Mesh(geo3, glassMaterialCyan);
    mesh3.position.set(innerLeftX, 0, 0);
    scene.add(mesh3);
    objects.push({ mesh: mesh3, rotSpeedX: 0.002, rotSpeedY: 0.003, isBreathe: true });

    // 4. Middle Right: Smooth Torus
    const geo4 = new THREE.TorusGeometry(1.3, 0.5, 32, 100);
    const mesh4 = new THREE.Mesh(geo4, glassMaterial);
    mesh4.position.set(innerRightX, -1, 1);
    scene.add(mesh4);
    objects.push({ mesh: mesh4, rotSpeedX: -0.004, rotSpeedY: 0.005 });

    // 5. Bottom Left: Cylinder/Capsule (abstract)
    const geo5 = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);
    const mesh5 = new THREE.Mesh(geo5, glassMaterialDark);
    mesh5.position.set(leftX, -4, -3);
    scene.add(mesh5);
    objects.push({ mesh: mesh5, rotSpeedX: 0.006, rotSpeedY: 0.002 });

    // 6. Bottom Right: Dodecahedron
    const geo6 = new THREE.DodecahedronGeometry(1.4, 0);
    const mesh6 = new THREE.Mesh(geo6, glassMaterialCyan);
    mesh6.position.set(rightX, -4.5, -1);
    scene.add(mesh6);
    objects.push({ mesh: mesh6, rotSpeedX: -0.003, rotSpeedY: -0.004 });

    // 7. Extra far left floating object
    const geo7 = new THREE.TorusKnotGeometry(0.8, 0.2, 64, 8);
    const mesh7 = new THREE.Mesh(geo7, glassMaterial);
    mesh7.position.set(leftX - 1, -2, -5);
    scene.add(mesh7);
    objects.push({ mesh: mesh7, rotSpeedX: -0.005, rotSpeedY: 0.008 });

    // 8. Extra far right breathing sphere
    const geo8 = new THREE.SphereGeometry(1.0, 32, 32);
    const mesh8 = new THREE.Mesh(geo8, glassMaterialDark);
    mesh8.position.set(rightX + 1, 2, -4);
    scene.add(mesh8);
    objects.push({ mesh: mesh8, rotSpeedX: 0.004, rotSpeedY: -0.004, isBreathe: true });


    // --- Interaction Variables ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // --- Event Listeners ---
    document.addEventListener('mousemove', (event) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Adjust positions dynamically on resize if needed (simple approach: refresh page, or compute leftX dynamically if requested)
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Apply Mouse Parallax smoothly (Camera Move)
        targetX = mouseX * 0.0015;
        targetY = mouseY * 0.0015;

        // Ease camera towards target
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Update each object
        objects.forEach((obj) => {
            // Rotation
            obj.mesh.rotation.x += obj.rotSpeedX;
            obj.mesh.rotation.y += obj.rotSpeedY;

            // REMOVED Scroll parallax tracking (obj.mesh.position.y = ...) 
            // Now they stay fixed in their screen regions regardless of scrolling down the page.

            // Organic breathing for specific shapes
            if (obj.isBreathe) {
                const scale = 1 + Math.sin(elapsedTime * 2) * 0.08; // 8% scale deformation
                obj.mesh.scale.set(scale, scale, scale);
            }
        });

        renderer.render(scene, camera);
    }

    // Start
    animate();
});
