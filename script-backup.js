// Particles animation with healthcare theme
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container
    function resizeCanvas() {
        const container = document.querySelector('.particles-container');
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
            const currentSize = this.size * pulseFactor;
            
            // Draw different healthcare symbols
            switch(this.symbol) {
                case 'dna':
                    this.drawDNA(currentSize);
                    break;
                case 'pulse':
                    this.drawPulse(currentSize);
                    break;
                case 'cross':
                    this.drawCross(currentSize);
                    break;
                case 'pill':
                    this.drawPill(currentSize);
                    break;
            }
            
            ctx.restore();
        }
        
        drawDNA(size) {
            const s = size * 1.5;
            
            // Add shadow for glow effect
            ctx.shadowColor = this.color;
            ctx.shadowBlur = this.glow;
            
            ctx.strokeStyle = this.color;
            ctx.lineWidth = size / 6;
            
            // Draw more detailed DNA double helix
            const helixWidth = s * 1.2;
            const helixHeight = s * 2;
            const steps = 12; // More steps for smoother helix
            
            // Draw the two strands with connecting rungs
            for (let i = 0; i <= steps; i++) {
                const progress = i / steps;
                const angle = progress * Math.PI * 2;
                
                // Calculate points on the two strands
                const x1 = -helixWidth/2 + Math.sin(angle) * helixWidth/2;
                const y1 = -helixHeight/2 + progress * helixHeight;
                
                const x2 = helixWidth/2 - Math.sin(angle) * helixWidth/2;
                const y2 = -helixHeight/2 + progress * helixHeight;
                
                // Draw connecting rung between strands
                if (i % 2 === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
                
                // Draw strand segments
                if (i > 0) {
                    const prevProgress = (i-1) / steps;
                    const prevAngle = prevProgress * Math.PI * 2;
                    
                    const prevX1 = -helixWidth/2 + Math.sin(prevAngle) * helixWidth/2;
                    const prevY1 = -helixHeight/2 + prevProgress * helixHeight;
                    
                    const prevX2 = helixWidth/2 - Math.sin(prevAngle) * helixWidth/2;
                    const prevY2 = -helixHeight/2 + prevProgress * helixHeight;
                    
                    // Draw first strand segment
                    ctx.beginPath();
                    ctx.moveTo(prevX1, prevY1);
                    ctx.lineTo(x1, y1);
                    ctx.stroke();
                    
                    // Draw second strand segment
                    ctx.beginPath();
                    ctx.moveTo(prevX2, prevY2);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            }
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
        
        drawPulse(size) {
            const s = size * 2;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = size / 4;
            
            // Draw heartbeat line
            ctx.beginPath();
            ctx.moveTo(-s, 0);
            ctx.lineTo(-s/2, 0);
            ctx.lineTo(-s/4, -s/2);
            ctx.lineTo(0, s/2);
            ctx.lineTo(s/4, -s/2);
            ctx.lineTo(s/2, 0);
            ctx.lineTo(s, 0);
            ctx.stroke();
        }
        
        drawCross(size) {
            const s = size * 1.2;
            ctx.fillStyle = this.color;
            
            // Draw medical cross
            ctx.fillRect(-s/4, -s/2, s/2, s);
            ctx.fillRect(-s/2, -s/4, s, s/2);
        }
        
        drawPill(size) {
            const s = size * 1.5;
            ctx.fillStyle = this.color;
            
            // Draw pill capsule
            ctx.beginPath();
            ctx.ellipse(0, 0, s/2, s, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw line in middle
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -s/2);
            ctx.lineTo(0, s/2);
            ctx.stroke();
        }
    }
    
    // Create particles
    const particles = [];
    const particleCount = 25; // Even fewer particles for clearer, more professional look
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connect particles with lines if they are close enough
    function connectParticles() {
        const maxDistance = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    // Use gradient color for connections
                    const gradientPosition = distance / maxDistance;
                    ctx.beginPath();
                    ctx.strokeStyle = getGradientColor(gradientPosition);
                    ctx.globalAlpha = (1 - (distance / maxDistance)) * 0.5;
                    ctx.lineWidth = 0.6;
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
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Add interactive effect - particles move toward cursor
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        for (let i = 0; i < particles.length; i++) {
            // Only affect particles within a certain radius
            const dx = mouseX - particles[i].x;
            const dy = mouseY - particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                // Add a slight attraction toward the cursor
                particles[i].speedX += dx * 0.0005;
                particles[i].speedY += dy * 0.0005;
                
                // Limit speed
                const maxSpeed = 2;
                const currentSpeed = Math.sqrt(particles[i].speedX * particles[i].speedX + particles[i].speedY * particles[i].speedY);
                if (currentSpeed > maxSpeed) {
                    particles[i].speedX = (particles[i].speedX / currentSpeed) * maxSpeed;
                    particles[i].speedY = (particles[i].speedY / currentSpeed) * maxSpeed;
                }
            }
        }
    });
    
    // Particle web animation in the dedicated container
    const particleWebCanvas = document.getElementById('particle-web');
    if (particleWebCanvas) {
        // Create particle web animation
        createParticleWeb(particleWebCanvas);
    }
    
    function createFloatingECG(container) {
        const ecgSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        ecgSvg.setAttribute('width', '100%');
        ecgSvg.setAttribute('height', '100%');
        ecgSvg.style.position = 'absolute';
        ecgSvg.style.top = '0';
        ecgSvg.style.left = '0';
        ecgSvg.style.opacity = '0.25';
        ecgSvg.style.pointerEvents = 'none';
        ecgSvg.style.filter = 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.6))'; // Add glow effect
        
        // Create ECG path
        const ecgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        ecgPath.setAttribute('stroke', 'url(#ecgGradient)');
        ecgPath.setAttribute('stroke-width', '2');
        ecgPath.setAttribute('fill', 'none');
        
        // Create gradient
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'ecgGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '0%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#8A2BE2');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#0099FF');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.appendChild(gradient);
        
        ecgSvg.appendChild(defs);
        ecgSvg.appendChild(ecgPath);
        container.appendChild(ecgSvg);
        
        // Generate ECG path with blip effect
        function generateECGPath() {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            const segments = 6; // Fewer, wider segments for more professional look
            const segmentWidth = width / segments;
            
            let pathData = '';
            let y = height * 0.8; // Position ECG lower in the container
            
            // Start path
            pathData = `M 0,${y} `;
            
            // Generate ECG pattern across the width with more realistic blips
            for (let i = 0; i < segments; i++) {
                const x = i * segmentWidth;
                
                // Flat line segment
                if (i % 3 !== 1) {
                    // Mostly flat with tiny variations for realism
                    for (let j = 0; j < 10; j++) {
                        const xPos = x + (segmentWidth * j / 10);
                        const yVariation = Math.random() * 2 - 1; // Tiny random variation
                        pathData += `L ${xPos},${y + yVariation} `;
                    }
                } 
                // ECG blip (QRS complex)
                else {
                    // Initial flat segment
                    pathData += `L ${x + segmentWidth * 0.1},${y} `;
                    
                    // P wave (small bump)
                    pathData += `C ${x + segmentWidth * 0.15},${y - height * 0.01} ${x + segmentWidth * 0.2},${y - height * 0.01} ${x + segmentWidth * 0.25},${y} `;
                    
                    // PR segment (flat)
                    pathData += `L ${x + segmentWidth * 0.3},${y} `;
                    
                    // QRS complex (sharp spike)
                    pathData += `L ${x + segmentWidth * 0.32},${y - height * 0.01} `; // Q wave
                    pathData += `L ${x + segmentWidth * 0.35},${y + height * 0.15} `; // R wave (tall spike)
                    pathData += `L ${x + segmentWidth * 0.37},${y - height * 0.05} `; // S wave (downward deflection)
                    
                    // ST segment (slight elevation)
                    pathData += `L ${x + segmentWidth * 0.45},${y - height * 0.01} `;
                    
                    // T wave (rounded)
                    pathData += `C ${x + segmentWidth * 0.5},${y - height * 0.03} ${x + segmentWidth * 0.55},${y - height * 0.03} ${x + segmentWidth * 0.6},${y} `;
                    
                    // Back to baseline
                    pathData += `L ${x + segmentWidth},${y} `;
                }
            }
            
            ecgPath.setAttribute('d', pathData);
            
            // Animate the ECG line
            const ecgAnimation = ecgPath.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: `translateX(-${segmentWidth * 3}px)` }
                ],
                {
                    duration: 6000,
                    iterations: Infinity,
                    easing: 'linear'
                }
            );
        }
        
        generateECGPath();
        window.addEventListener('resize', generateECGPath);
    }

    function createParticleWeb(canvas) {
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to match container
        function resizeCanvas() {
            const container = canvas.parentElement;
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
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});