// Main animation script for Klyrone website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize both animations
    initParticleAnimation();
    initParticleWebAnimation();
    
    // Set up intersection observer for fade-in animations
    setupIntersectionObserver();
    
    // Set up smooth scrolling
    setupSmoothScrolling();
    
    // Set up mobile menu toggle
    setupMobileMenu();
});

// Particles animation with healthcare theme
function initParticleAnimation() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    function resizeCanvas() {
        const container = document.querySelector('.particles-container');
        if (!container) return;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Klyrone gradient colors
    const startColor = { r: 138, g: 43, b: 226 }; // #8A2BE2 (purple)
    const endColor = { r: 0, g: 153, b: 255 };    // #0099FF (blue)
    
    // Helper function to get a color from the gradient
    function getGradientColor(position) {
        const r = Math.floor(startColor.r + position * (endColor.r - startColor.r));
        const g = Math.floor(startColor.g + position * (endColor.g - startColor.g));
        const b = Math.floor(startColor.b + position * (endColor.b - startColor.b));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Healthcare symbols
    const symbols = [
        { type: 'dna', frequency: 0.5 },     // Increased DNA frequency
        { type: 'pulse', frequency: 0.2 },
        { type: 'cross', frequency: 0.15 },
        { type: 'pill', frequency: 0.15 }
    ];
    
    // Particle class with healthcare theme
    class Particle {
        constructor() {
            this.reset();
            // Start from random positions
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.opacity = Math.random() * 0.5 + 0.2;
            
            // Determine symbol type based on frequency
            const rand = Math.random();
            let cumulative = 0;
            for (const symbol of symbols) {
                cumulative += symbol.frequency;
                if (rand <= cumulative) {
                    this.symbol = symbol.type;
                    break;
                }
            }
        }
        
        reset() {
            // For new particles or when recycling
            // Larger size for DNA, normal size for others
            this.baseSize = this.symbol === 'dna' ? 
                Math.random() * 12 + 8 :  // Much larger DNA (8-20)
                Math.random() * 5 + 3;    // Normal size for other symbols (3-8)
            
            this.size = this.baseSize;
            this.speedX = Math.random() * 0.4 - 0.2; // Slower movement for more professional look
            this.speedY = Math.random() * 0.4 - 0.2;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() * 0.01 - 0.005) * (Math.random() < 0.5 ? -1 : 1); // Subtler rotation
            this.colorPosition = Math.random();
            this.color = getGradientColor(this.colorPosition);
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.03 + Math.random() * 0.03; // Slower pulse for more professional look
            this.pulseSize = this.size * 0.15; // Subtler pulse
            
            // Add glow effect for more professional look
            this.glow = this.symbol === 'dna' ? 15 : 8; // Stronger glow for DNA
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            this.pulsePhase += this.pulseSpeed;
            
            // Wrap around edges
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            
            // Pulsing effect
            const pulseFactor = 1 + Math.sin(this.pulsePhase) * 0.2;
            const size = this.size * pulseFactor;
            
            // Add glow effect
            ctx.shadowBlur = this.glow;
            ctx.shadowColor = this.color;
            
            // Draw the appropriate healthcare symbol
            switch (this.symbol) {
                case 'dna':
                    this.drawDNA(size);
                    break;
                case 'pulse':
                    this.drawPulse(size);
                    break;
                case 'cross':
                    this.drawCross(size);
                    break;
                case 'pill':
                    this.drawPill(size);
                    break;
            }
            
            ctx.restore();
        }
        
        drawDNA(size) {
            const helixWidth = size * 0.6;
            const helixHeight = size;
            const rungs = 4; // Number of rungs in the DNA ladder
            
            ctx.strokeStyle = this.color;
            ctx.lineWidth = size * 0.1;
            
            // Draw the two helixes
            ctx.beginPath();
            
            // First helix
            ctx.moveTo(-helixWidth / 2, -helixHeight / 2);
            
            for (let i = 0; i <= rungs * 2; i++) {
                const t = i / (rungs * 2);
                const x = helixWidth / 2 * Math.sin(t * Math.PI * 2);
                const y = -helixHeight / 2 + t * helixHeight;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            
            // Second helix
            ctx.beginPath();
            ctx.moveTo(helixWidth / 2, -helixHeight / 2);
            
            for (let i = 0; i <= rungs * 2; i++) {
                const t = i / (rungs * 2);
                const x = helixWidth / 2 * Math.sin(t * Math.PI * 2 + Math.PI);
                const y = -helixHeight / 2 + t * helixHeight;
                
                ctx.lineTo(x, y);
            }
            
            ctx.stroke();
            
            // Draw the rungs
            for (let i = 0; i < rungs; i++) {
                const t = (i + 0.5) / rungs;
                const y = -helixHeight / 2 + t * helixHeight;
                const x1 = helixWidth / 2 * Math.sin(t * Math.PI * 4);
                const x2 = helixWidth / 2 * Math.sin(t * Math.PI * 4 + Math.PI);
                
                ctx.beginPath();
                ctx.moveTo(x1, y);
                ctx.lineTo(x2, y);
                ctx.stroke();
            }
        }
        
        drawPulse(size) {
            const width = size * 1.5;
            const height = size * 0.8;
            
            ctx.strokeStyle = this.color;
            ctx.lineWidth = size * 0.15;
            
            ctx.beginPath();
            ctx.moveTo(-width / 2, 0);
            ctx.lineTo(-width / 4, 0);
            ctx.lineTo(-width / 6, -height / 2);
            ctx.lineTo(-width / 12, height / 2);
            ctx.lineTo(width / 12, -height / 4);
            ctx.lineTo(width / 6, 0);
            ctx.lineTo(width / 2, 0);
            ctx.stroke();
        }
        
        drawCross(size) {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = size * 0.2;
            
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.lineTo(0, size / 2);
            ctx.moveTo(-size / 2, 0);
            ctx.lineTo(size / 2, 0);
            ctx.stroke();
        }
        
        drawPill(size) {
            const width = size * 1.2;
            const height = size * 0.5;
            
            ctx.fillStyle = this.color;
            
            // Draw pill capsule
            ctx.beginPath();
            ctx.ellipse(-width / 4, 0, height / 2, height / 2, 0, 0, Math.PI * 2);
            ctx.ellipse(width / 4, 0, height / 2, height / 2, 0, 0, Math.PI * 2);
            ctx.rect(-width / 4, -height / 2, width / 2, height);
            ctx.fill();
            
            // Draw dividing line
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -height / 2);
            ctx.lineTo(0, height / 2);
            ctx.stroke();
        }
    }
    
    // Create particles
    const particles = [];
    const particleCount = 50; // Increased number of particles for more visual impact
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connect particles with lines if they are close enough
    function connectParticles() {
        const maxDistance = 180; // Increased maximum distance for connection
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Calculate opacity based on distance
                    const opacity = 0.2 * (1 - distance / maxDistance);
                    
                    // Get gradient color
                    const avgColorPos = (particles[i].colorPosition + particles[j].colorPosition) / 2;
                    const r = Math.floor(startColor.r + avgColorPos * (endColor.r - startColor.r));
                    const g = Math.floor(startColor.g + avgColorPos * (endColor.g - startColor.g));
                    const b = Math.floor(startColor.b + avgColorPos * (endColor.b - startColor.b));
                    
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (const particle of particles) {
            particle.update();
            particle.draw();
        }
        
        // Connect particles
        connectParticles();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Add interactive effect - particles move toward cursor
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        for (const particle of particles) {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) { // Increased interaction radius
                // Attraction force
                const force = 0.3; // Stronger force for more responsive interaction
                const directionX = dx / distance;
                const directionY = dy / distance;
                
                // Apply force to particle velocity
                particle.speedX += directionX * force;
                particle.speedY += directionY * force;
                
                // Limit speed
                const maxSpeed = 2;
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (speed > maxSpeed) {
                    particle.speedX = (particle.speedX / speed) * maxSpeed;
                    particle.speedY = (particle.speedY / speed) * maxSpeed;
                }
            }
        }
    });
}

// Particle Web Animation
function initParticleWebAnimation() {
    const canvas = document.getElementById('particle-web');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    function resizeCanvas() {
        const container = canvas.parentElement;
        if (!container) return;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Klyrone gradient colors
    const startColor = { r: 138, g: 43, b: 226 }; // #8A2BE2 (purple)
    const endColor = { r: 0, g: 153, b: 255 };    // #0099FF (blue)
    
    // Helper function to get a color from the gradient
    function getGradientColor(position) {
        const r = Math.floor(startColor.r + position * (endColor.r - startColor.r));
        const g = Math.floor(startColor.g + position * (endColor.g - startColor.g));
        const b = Math.floor(startColor.b + position * (endColor.b - startColor.b));
        
        return `rgba(${r}, ${g}, ${b},`;
    }
    
    // Node class for particle web
    class Node {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4; // Slower movement for more stability
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1.5; // Slightly larger nodes
            this.colorPosition = Math.random();
            this.color = getGradientColor(this.colorPosition);
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + '0.8)'; // More opaque nodes
            ctx.fill();
        }
    }
    
    // Create nodes
    const nodes = [];
    
    // Adjust node count based on screen size
    let nodeCount = 180; // Default for larger screens
    
    // Reduce density for smaller screens
    function adjustNodeDensity() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 1366) { // 15-inch laptop typical width
            nodeCount = 100; // Reduced density for smaller screens
        } else if (screenWidth < 1600) {
            nodeCount = 140; // Medium density for medium screens
        } else {
            nodeCount = 180; // Full density for large screens
        }
        
        // Clear existing nodes and recreate with new density
        if (nodes.length > 0) {
            nodes.length = 0;
            createNodes();
        }
    }
    
    // Listen for window resize to adjust density
    window.addEventListener('resize', adjustNodeDensity);
    
    // Function to create nodes based on current nodeCount
    function createNodes() {
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node());
        }
    }
    
    // Initial density adjustment and node creation
    adjustNodeDensity();
    createNodes();
    
    // Draw connections between nodes
    function drawConnections() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Adjust connection distance based on screen size
                let maxDistance = 180; // Default for larger screens
                
                // Use smaller connection distance on smaller screens
                const screenWidth = window.innerWidth;
                if (screenWidth < 1366) { // 15-inch laptop typical width
                    maxDistance = 140; // Reduced connection distance for smaller screens
                } else if (screenWidth < 1600) {
                    maxDistance = 160; // Medium connection distance
                }
                
                if (distance < maxDistance) {
                    // Calculate opacity based on distance
                    const opacity = 1 - (distance / maxDistance);
                    
                    // Draw line between nodes
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    
                    // Use gradient color with opacity
                    const gradientPosition = (nodes[i].colorPosition + nodes[j].colorPosition) / 2;
                    ctx.strokeStyle = getGradientColor(gradientPosition) + opacity * 0.6 + ')';
                    ctx.lineWidth = 0.8; // Thicker connections for more visibility
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw nodes
        for (const node of nodes) {
            node.update();
            node.draw();
        }
        
        // Draw connections
        drawConnections();
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Add interactive effect - nodes move toward cursor
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Move nodes toward cursor
        for (const node of nodes) {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 250) { // Increased interaction radius
                const force = 0.3; // Stronger force for more responsive interaction
                node.vx += (dx / distance) * force;
                node.vy += (dy / distance) * force;
                
                // Limit velocity
                const maxVelocity = 2;
                const velocity = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
                if (velocity > maxVelocity) {
                    node.vx = (node.vx / velocity) * maxVelocity;
                    node.vy = (node.vy / velocity) * maxVelocity;
                }
            }
        }
    });
}

// Set up intersection observer for fade-in animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards, solution cards, case study cards, and team members
    const elements = document.querySelectorAll('.feature-card, .solution-card, .case-study-card, .team-member, .partner-logo');
    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// Set up smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if it's open
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
}

// Set up mobile menu toggle functionality
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navLinks.contains(event.target) && !mobileMenuToggle.contains(event.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}
