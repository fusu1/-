/**
 * Antigravity High-Performance Particle Engine
 * Purpose: Render a smooth, high-end "white-paper" aesthetic background 
 * with blue/purple glowing orbs that drift slowly based on time, without mouse interference.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Config
    const NUM_PARTICLES = 15; // Number of floating orbs (low count for minimal style)
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            
            // Random radius between 50 and 200
            this.radius = Math.random() * 150 + 50; 
            
            // Velocity components
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            
            // Phase for pulsating effect
            this.alphaPhase = Math.random() * Math.PI * 2;
            this.alphaSpeed = Math.random() * 0.01 + 0.005;

            // Base colors (light blue, light purple)
            const colors = [
                { r: 168, g: 237, b: 234 }, // Light teal
                { r: 254, g: 214, b: 227 }, // Soft pink
                { r: 224, g: 195, b: 252 }, // Soft purple
                { r: 142, g: 197, b: 252 }  // Soft blue
            ];
            this.baseColor = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges smoothly
            if (this.x - this.radius > width) this.vx *= -1;
            if (this.x + this.radius < 0) this.vx *= -1;
            if (this.y - this.radius > height) this.vy *= -1;
            if (this.y + this.radius < 0) this.vy *= -1;

            // In case it goes wildly out of bounds due to resize
            if (this.x > width + this.radius) this.x = width - this.radius;
            if (this.y > height + this.radius) this.y = height - this.radius;
            
            // Pulsating alpha
            this.alphaPhase += this.alphaSpeed;
        }

        draw() {
            // Calculate pulsating opacity
            const baseAlpha = 0.3; // Base maximum opacity (keep it low for minimal aesthetic)
            const alpha = baseAlpha + (Math.sin(this.alphaPhase) * 0.1);
            
            // Determine if dark mode is active to adjust blending/opacity
            const isDarkMode = document.body.classList.contains('dark-mode');
            const finalAlpha = isDarkMode ? alpha * 0.5 : alpha; // dimmer in dark mode

            // Radial gradient for smooth soft edges
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0, 
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, ${finalAlpha})`);
            gradient.addColorStop(1, `rgba(${this.baseColor.r}, ${this.baseColor.g}, ${this.baseColor.b}, 0)`);
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < NUM_PARTICLES; i++) {
            particles.push(new Particle());
        }
        window.addEventListener('resize', resize);
        requestAnimationFrame(animate);
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        // Fix for high DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }

    function animate() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Update and draw
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    // Start Engine
    init();
});
