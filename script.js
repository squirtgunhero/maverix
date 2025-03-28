// Animated Circular Segment Background for MAVERIX
document.addEventListener('DOMContentLoaded', function() {
    // Get the animation container
    const container = document.getElementById('circular-animation');
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full container size
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Append the canvas to the container
    container.appendChild(canvas);
    
    // Animation variables
    let time = 0;
    let baseRotation = 0;
    let targetRotation = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let circleScale = 1;
    let targetScale = 1;
    
    // Track mouse/touch movement
    function updatePointerPosition(x, y) {
        targetMouseX = x / window.innerWidth;
        targetMouseY = y / window.innerHeight;
    }
    
    document.addEventListener('mousemove', function(e) {
        updatePointerPosition(e.clientX, e.clientY);
    });
    
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 0) {
            updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault();
        }
    });
    
    // Interactive elements
    let ripples = [];
    let particles = [];
    let hoverIntensity = 0;
    
    // Unified handler for mouse/touch interaction
    function createRipple(x, y) {
        ripples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.2,
            opacity: 0.7,
            speed: 4
        });
        
        // Create burst of particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                life: 100,
                opacity: Math.random() * 0.5 + 0.5
            });
        }
        
        // Scale effect on interaction
        targetScale = 1.05;
        setTimeout(() => {
            targetScale = 1;
        }, 500);
    }
    
    document.addEventListener('mousedown', function(e) {
        createRipple(e.clientX, e.clientY);
    });
    
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 0) {
            createRipple(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault();
        }
    });
    
    // Generate circular segments
    const segments = [];
    const outerGlowSegments = [];
    
    function generateSegments() {
        segments.length = 0;
        outerGlowSegments.length = 0;
        
        // Number of rings
        const rings = 5;
        
        // Increase base size for a larger circle
        const ringBaseSize = Math.min(canvas.width, canvas.height) * 0.5; // Increased to 50% of viewport
        
        for (let r = 0; r < rings; r++) {
            const ringRadius = (r + 1) / rings * ringBaseSize;
            const ringWidth = ringBaseSize * 0.03;
            
            // More segments for larger rings
            const segmentsInRing = 16 + r * 8;
            
            for (let s = 0; s < segmentsInRing; s++) {
                // Determine angle for this segment
                const segmentAngle = s * (Math.PI * 2 / segmentsInRing);
                
                // Calculate position in normalized space
                const normalizedX = Math.cos(segmentAngle) * 0.5 + 0.5;
                const normalizedY = Math.sin(segmentAngle) * 0.5 + 0.5;
                
                // Create a clear central area (for the circular text backdrop)
                const distanceFromCenter = Math.sqrt(
                    Math.pow(normalizedX - 0.5, 2) + 
                    Math.pow(normalizedY - 0.5, 2)
                );
                
                // Larger central empty area to make room for circular text backdrop
                const isCentralArea = distanceFromCenter < 0.25;
                
                // Randomize if this segment appears (higher probability for a fuller circle)
                // No segments in central area
                if (!isCentralArea && Math.random() > 0.2) {
                    const arcLength = (Math.random() * 0.6 + 0.4) * (Math.PI * 2 / segmentsInRing);
                    const startAngle = segmentAngle + (Math.random() * 0.2);
                    const endAngle = startAngle + arcLength;
                    
                    // Determine if it's a solid segment or dashed
                    const isDashed = Math.random() > 0.5;
                    const dashCount = isDashed ? Math.floor(Math.random() * 3) + 2 : 1;
                    const dashArray = [];
                    
                    if (isDashed) {
                        const dashLength = arcLength / (dashCount * 2 - 1);
                        for (let d = 0; d < dashCount; d++) {
                            dashArray.push({
                                start: startAngle + d * 2 * dashLength,
                                end: startAngle + d * 2 * dashLength + dashLength
                            });
                        }
                    } else {
                        dashArray.push({
                            start: startAngle,
                            end: endAngle
                        });
                    }
                    
                    // Fade segments as they get closer to the center
                    const centralProximity = Math.max(0, 1 - distanceFromCenter * 2);
                    const baseOpacity = 0.8 + Math.random() * 0.2;
                    const adjustedOpacity = baseOpacity * (1 - centralProximity * 0.7);
                    
                    segments.push({
                        ring: r,
                        radius: ringRadius,
                        width: ringWidth * (isDashed ? 0.7 : 1), 
                        dashArray: dashArray,
                        pulseSpeed: Math.random() * 0.01 + 0.005,
                        pulseOffset: Math.random() * Math.PI * 2,
                        fadeSpeed: Math.random() * 0.002 + 0.001,
                        fadeOffset: Math.random() * Math.PI * 2,
                        opacity: adjustedOpacity,
                        rotationOffset: (Math.random() - 0.5) * 0.04,
                        isCentralArea: isCentralArea
                    });
                }
            }
        }
        
        // Add outer glow segments (fewer, larger)
        const glowRings = 2;
        for (let r = 0; r < glowRings; r++) {
            const ringRadius = Math.min(canvas.width, canvas.height) * (0.4 + r * 0.05);
            const segmentsInRing = 12;
            
            for (let s = 0; s < segmentsInRing; s++) {
                if (Math.random() > 0.5) {
                    const arcLength = (Math.random() * 0.5 + 0.3) * (Math.PI * 2 / segmentsInRing);
                    const startAngle = s * (Math.PI * 2 / segmentsInRing) + (Math.random() * 0.4);
                    
                    outerGlowSegments.push({
                        radius: ringRadius,
                        width: Math.min(canvas.width, canvas.height) * 0.005,
                        startAngle: startAngle,
                        endAngle: startAngle + arcLength,
                        opacity: Math.random() * 0.15 + 0.05,
                        pulseSpeed: Math.random() * 0.008 + 0.002
                    });
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        // Update time
        time += 0.01;
        
        // Smooth mouse tracking
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        
        // Mouse influence on rotation
        targetRotation = (mouseX - 0.5) * 0.2;
        baseRotation += 0.001; // Base rotation speed
        let currentRotation = baseRotation + targetRotation * hoverIntensity;
        
        // Update hover intensity
        if (mouseX > 0.1 && mouseX < 0.9 && mouseY > 0.1 && mouseY < 0.9) {
            hoverIntensity += (1 - hoverIntensity) * 0.02;
        } else {
            hoverIntensity += (0 - hoverIntensity) * 0.02;
        }
        
        // Update circle scale
        circleScale += (targetScale - circleScale) * 0.1;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.99)'; // Slight transparency for trail effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center point
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Draw outer glow
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentRotation * 0.3); // Slower rotation for glow
        ctx.scale(circleScale, circleScale);
        
        for (let i = 0; i < outerGlowSegments.length; i++) {
            const segment = outerGlowSegments[i];
            const pulse = Math.sin(time * segment.pulseSpeed) * 0.3 + 0.7;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${segment.opacity * pulse})`;
            ctx.lineWidth = segment.width * pulse;
            
            ctx.beginPath();
            ctx.arc(0, 0, segment.radius, segment.startAngle, segment.endAngle);
            ctx.stroke();
        }
        
        ctx.restore();
        
        // Draw circular segments
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentRotation);
        ctx.scale(circleScale, circleScale);
        
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            
            // Individual segment rotation
            ctx.save();
            ctx.rotate(currentRotation * segment.rotationOffset);
            
            // Pulsing effect
            const pulse = Math.sin(time * segment.pulseSpeed + segment.pulseOffset) * 0.1 + 0.9;
            const fade = (Math.sin(time * segment.fadeSpeed + segment.fadeOffset) * 0.1 + 0.9) * segment.opacity;
            
            // Distance from mouse influence (in normalized coordinates)
            const mouseAngle = Math.atan2(mouseY - 0.5, mouseX - 0.5);
            const segmentAngle = segment.dashArray[0].start + (segment.dashArray[0].end - segment.dashArray[0].start) / 2;
            const angleDiff = Math.abs(((mouseAngle - segmentAngle) + Math.PI) % (Math.PI * 2) - Math.PI);
            const mouseInfluence = Math.max(0, (1 - angleDiff / Math.PI) * hoverIntensity * 0.3);
            
            // Segment brightness based on mouse position
            const brightness = 255 - Math.min(60, mouseInfluence * 60);
            
            ctx.strokeStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${fade + mouseInfluence * 0.2})`;
            ctx.lineWidth = segment.width * (pulse + mouseInfluence * 0.3);
            
            for (let d = 0; d < segment.dashArray.length; d++) {
                const dash = segment.dashArray[d];
                ctx.beginPath();
                ctx.arc(0, 0, segment.radius, dash.start, dash.end);
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        ctx.restore();
        
        // Draw and update ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
            const ripple = ripples[i];
            
            // Expand ripple
            ripple.radius += ripple.speed;
            ripple.opacity -= 0.01;
            
            // Draw ripple if still visible
            if (ripple.opacity > 0) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity})`;
                ctx.lineWidth = 2 * (1 - ripple.radius / ripple.maxRadius);
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.stroke();
            } else {
                // Remove completed ripple
                ripples.splice(i, 1);
            }
        }
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96;
            p.vy *= 0.96;
            p.life -= 1;
            
            if (p.life > 0) {
                const opacity = (p.life / 100) * p.opacity;
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                particles.splice(i, 1);
            }
        }
        
        // Tiny floating particles for atmosphere
        if (Math.random() > 0.9) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.4;
            particles.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.5 + 0.5,
                life: 200 + Math.random() * 100,
                opacity: Math.random() * 0.2 + 0.1
            });
        }
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    function handleResize() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        generateSegments();
    }
    
    window.addEventListener('resize', handleResize);
    
    // Initialize segments and start animation
    generateSegments();
    animate();
});

// Scroll reveal animation
document.addEventListener('DOMContentLoaded', function() {
    // Initial animation for visible sections
    animateSectionsInView();
    
    // Add scroll listener for animations
    window.addEventListener('scroll', function() {
        animateSectionsInView();
    });
    
    function animateSectionsInView() {
        const sections = document.querySelectorAll('.content-section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // If section is at least 25% visible
            if (sectionTop < windowHeight - sectionHeight * 0.25) {
                section.classList.add('appear');
            }
        });
    }
    
    // Add circle animations similar to hero
    createBackgroundCircles();
});

// Create animated circle elements in the background
function createBackgroundCircles() {
    const mainContent = document.querySelector('.main-content');
    
    for (let i = 0; i < 5; i++) {
        const size = Math.random() * 200 + 100;
        const circle = document.createElement('div');
        
        circle.classList.add('circle-decoration');
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.top = `${Math.random() * 100}%`;
        circle.style.left = `${Math.random() * 100}%`;
        circle.style.opacity = Math.random() * 0.05 + 0.02;
        circle.style.animationDuration = `${Math.random() * 30 + 30}s`;
        circle.style.animationDelay = `${Math.random() * 10}s`;
        
        mainContent.appendChild(circle);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Animate expertise cards when they enter viewport
    const expertiseCards = document.querySelectorAll('.expertise-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Add staggered delay to each card
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    
    // Initialize cards with starting styles
    expertiseCards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add subtle parallax effect to cards on mouse move
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        aboutSection.addEventListener('mousemove', (e) => {
            // Get cursor position
            const { clientX, clientY } = e;
            const { left, top, width, height } = aboutSection.getBoundingClientRect();
            
            // Calculate normalized position (0 to 1)
            const xPos = (clientX - left) / width;
            const yPos = (clientY - top) / height;
            
            // Apply subtle movement to cards
            expertiseCards.forEach((card, index) => {
                const xOffset = (xPos - 0.5) * 10 * (index % 3 === 0 ? -1 : 1);
                const yOffset = (yPos - 0.5) * 10 * (index % 2 === 0 ? -1 : 1);
                
                card.style.transform = `translateY(0) translateX(${xOffset}px) translateY(${yOffset}px)`;
            });
        });
        
        // Reset positions when mouse leaves
        aboutSection.addEventListener('mouseleave', () => {
            expertiseCards.forEach((card) => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Set up interactive icon particles
    const iconParticles = document.querySelectorAll('.icon-particles');
    
    iconParticles.forEach(particleContainer => {
        // Create particles
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random positioning
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Size and opacity
            const size = Math.random() * 4 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.opacity = Math.random() * 0.5 + 0.3;
            
            // Add to container
            particleContainer.appendChild(particle);
        }
    });
    
    // Add mouse movement effect to icons
    const interactiveIcons = document.querySelectorAll('.service-icon.interactive');
    
    interactiveIcons.forEach(icon => {
        icon.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element
            
            // Calculate center of the element
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate displacement from center
            const displacementX = (x - centerX) / centerX * 5; // Max 5px movement
            const displacementY = (y - centerY) / centerY * 5;
            
            // Apply transformation to the SVG
            const svg = this.querySelector('svg');
            svg.style.transform = `translate(${displacementX}px, ${displacementY}px)`;
            
            // Move particles in opposite direction for depth effect
            const particles = this.querySelectorAll('.particle');
            particles.forEach(particle => {
                particle.style.transform = `translate(${-displacementX * 1.5}px, ${-displacementY * 1.5}px)`;
            });
        });
        
        // Reset position when mouse leaves
        icon.addEventListener('mouseleave', function() {
            const svg = this.querySelector('svg');
            svg.style.transform = '';
            
            const particles = this.querySelectorAll('.particle');
            particles.forEach(particle => {
                particle.style.transform = '';
            });
        });
        
        // Pulse effect on click
        icon.addEventListener('click', function() {
            // Add pulse class
            this.classList.add('pulse');
            
            // Remove class after animation completes
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 700);
        });
    });
    
    // Add CSS for particle styling
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(0, 0);
            transition: transform 0.2s ease;
        }
        
        .service-icon.interactive.pulse svg {
            animation: pulse 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D chessboard with checkmate position
    initializeChessboard();
    
    function initializeChessboard() {
        const chessboard = document.querySelector('.chessboard-3d');
        if (!chessboard) return;
        
        // Clear any existing content
        chessboard.innerHTML = '';
        
        // Create a 4x4 chessboard (simplified version)
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const square = document.createElement('div');
                square.classList.add('chess-square');
                
                // Alternate colors
                if ((row + col) % 2 === 0) {
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }
                
                // Position the square in 3D space
                square.style.transform = `translate3d(${col * 25}%, ${row * 25}%, 0)`;
                
                // Mark edge squares for border styling
                if (row === 3) square.classList.add('at-edge', 'front');
                if (col === 3) square.classList.add('at-edge', 'right');
                
                chessboard.appendChild(square);
            }
        }
        
        // Checkmate position pieces
        // This is a classic back-rank checkmate scenario
        const pieces = [
            { type: '♚', color: 'black', row: 0, col: 1, classes: 'checkmated' }, // Black King (checkmated)
            { type: '♟', color: 'black', row: 1, col: 0 }, // Black Pawn
            { type: '♟', color: 'black', row: 1, col: 1 }, // Black Pawn
            { type: '♟', color: 'black', row: 1, col: 2 }, // Black Pawn
            { type: '♛', color: 'white', row: 3, col: 1 }, // White Queen giving checkmate
            { type: '♚', color: 'white', row: 3, col: 3 }  // White King
        ];
        
        // Create chess pieces
        pieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('chess-piece', piece.color);
            if (piece.classes) {
                piece.classes.split(' ').forEach(cls => pieceElement.classList.add(cls));
            }
            
            // Set data attribute for the symbol
            pieceElement.setAttribute('data-symbol', piece.type);
            
            // Position the piece
            const x = piece.col * 25 + 12.5;
            const y = piece.row * 25 + 12.5;
            pieceElement.style.transform = `translate3d(${x}%, ${y}%, 5px)`;
            
            chessboard.appendChild(pieceElement);
        });
        
        // Add subtle animation for checkmate effect
        setTimeout(() => {
            // Highlight the checkmate squares with a subtle glow
            const checkmatedKing = document.querySelector('.chess-piece.checkmated');
            const attackingQueen = document.querySelectorAll('.chess-piece')[4]; // The white queen
            
            if (checkmatedKing && attackingQueen) {
                // Create a line showing the attack
                const line = document.createElement('div');
                line.classList.add('attack-line');
                line.style.cssText = `
                    position: absolute;
                    height: 2px;
                    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
                    transform-origin: left center;
                    opacity: 0;
                    transition: opacity 1s ease;
                    z-index: 1;
                `;
                
                // Get positions to draw the line
                const kingRect = checkmatedKing.getBoundingClientRect();
                const queenRect = attackingQueen.getBoundingClientRect();
                const boardRect = chessboard.getBoundingClientRect();
                
                // Calculate relative positions
                const startX = (queenRect.left + queenRect.width/2 - boardRect.left) / boardRect.width * 100;
                const startY = (queenRect.top + queenRect.height/2 - boardRect.top) / boardRect.height * 100;
                const endX = (kingRect.left + kingRect.width/2 - boardRect.left) / boardRect.width * 100;
                const endY = (kingRect.top + kingRect.height/2 - boardRect.top) / boardRect.height * 100;
                
                // Calculate line length and angle
                const dx = endX - startX;
                const dy = endY - startY;
                const length = Math.sqrt(dx*dx + dy*dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                line.style.width = `${length}%`;
                line.style.left = `${startX}%`;
                line.style.top = `${startY}%`;
                line.style.transform = `rotate(${angle}deg)`;
                
                chessboard.appendChild(line);
                
                // Animate the line
                setTimeout(() => {
                    line.style.opacity = '1';
                    
                    // Pulse animation
                    setInterval(() => {
                        line.style.opacity = '0.8';
                        setTimeout(() => {
                            line.style.opacity = '0.2';
                        }, 500);
                    }, 2000);
                }, 1000);
            }
        }, 500);
    }
    
    // Add mouse interaction for 3D effect
    const chessboardContainer = document.querySelector('.chessboard-container');
    if (chessboardContainer) {
        chessboardContainer.addEventListener('mousemove', function(e) {
            const chessboard = this.querySelector('.chessboard-3d');
            if (!chessboard) return;
            
            // Get mouse position relative to container
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on mouse position
            const rotateY = ((x / rect.width) - 0.5) * 20; // -10 to 10 degrees
            const rotateX = 45 + ((y / rect.height) - 0.5) * 10; // 40 to 50 degrees
            
            // Apply transformation (with dampening)
            chessboard.style.transform = `rotateX(${rotateX}deg) rotateZ(${rotateY}deg)`;
        });
        
        // Reset rotation when mouse leaves
        chessboardContainer.addEventListener('mouseleave', function() {
            const chessboard = this.querySelector('.chessboard-3d');
            if (!chessboard) return;
            
            // Reset and restart animation
            chessboard.style.transform = '';
            chessboard.style.animation = 'none';
            
            // Force reflow
            void chessboard.offsetWidth;
            
            // Restart animation
            chessboard.style.animation = 'subtle-rotate 20s infinite alternate ease-in-out';
        });
    }
});

// Add to your script.js - Professional 3D Chess Implementation

// First, add Three.js to your project by adding this line to your HTML head:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

document.addEventListener('DOMContentLoaded', function() {
    initChess3D();
    
    function initChess3D() {
        const canvas = document.getElementById('chess-scene');
        if (!canvas) return;
        
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);
        
        // Camera setup with professional parameters
        const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(5, 8, 7);
        camera.lookAt(3.5, 0, 3.5);
        
        // Professional lighting setup
        const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        scene.add(ambientLight);
        
        const keyLight = new THREE.DirectionalLight(0xffffff, 1);
        keyLight.position.set(5, 8, 5);
        keyLight.castShadow = true;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 25;
        keyLight.shadow.bias = -0.0001;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        scene.add(keyLight);
        
        // Fill light for professional lighting setup
        const fillLight = new THREE.DirectionalLight(0xaaaaff, 0.5);
        fillLight.position.set(-5, 3, -5);
        scene.add(fillLight);
        
        // Rim light for dramatic effect
        const rimLight = new THREE.DirectionalLight(0xffffaa, 0.3);
        rimLight.position.set(0, -5, 0);
        scene.add(rimLight);
        
        // High-end renderer configuration
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        
        // Create chessboard
        const boardGroup = new THREE.Group();
        scene.add(boardGroup);
        
        const boardSize = 8;
        const squareSize = 1;
        
        // Premium chessboard materials
        const darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.5,
            metalness: 0.1
        });
        
        const lightMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.4,
            metalness: 0.2
        });
        
        // Chessboard base with beveled edges
        const baseGeometry = new THREE.BoxGeometry(boardSize * squareSize + 0.4, 0.3, boardSize * squareSize + 0.4);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.3,
            metalness: 0.4
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.3;
        base.receiveShadow = true;
        boardGroup.add(base);
        
        // Create squares with beveled edges for realistic effect
        for (let x = 0; x < boardSize; x++) {
            for (let z = 0; z < boardSize; z++) {
                const isDark = (x + z) % 2 === 1;
                
                // Use slightly different square geometries for visual interest
                const squareGeometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize);
                
                const square = new THREE.Mesh(
                    squareGeometry,
                    isDark ? darkMaterial : lightMaterial
                );
                
                square.position.x = x * squareSize - (boardSize * squareSize) / 2 + squareSize / 2;
                square.position.z = z * squareSize - (boardSize * squareSize) / 2 + squareSize / 2;
                square.position.y = 0;
                
                square.receiveShadow = true;
                boardGroup.add(square);
            }
        }
        
        // Chess pieces setup for checkmate
        const pieces = [
            { type: 'king', color: 'white', position: [6, 7] },
            { type: 'queen', color: 'white', position: [4, 5] },
            { type: 'rook', color: 'white', position: [0, 7] },
            { type: 'king', color: 'black', position: [1, 0], checkmated: true },
            { type: 'pawn', color: 'black', position: [0, 1] },
            { type: 'pawn', color: 'black', position: [1, 1] },
            { type: 'pawn', color: 'black', position: [2, 1] }
        ];
        
        // Piece geometries - simplified for performance but still attractive
        const pieceGeometries = {
            pawn: new THREE.CylinderGeometry(0.2, 0.3, 0.6, 8),
            rook: new THREE.BoxGeometry(0.6, 0.8, 0.6),
            queen: new THREE.ConeGeometry(0.3, 1, 8),
            king: new THREE.CylinderGeometry(0.2, 0.4, 1, 8)
        };
        
        // Premium materials for chess pieces
        const whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            roughness: 0.2,
            metalness: 0.5
        });
        
        const blackMaterial = new THREE.MeshStandardMaterial({
            color: 0x555555,
            roughness: 0.4,
            metalness: 0.3
        });
        
        // Create and position pieces
        const piecesGroup = new THREE.Group();
        boardGroup.add(piecesGroup);
        
        pieces.forEach(piece => {
            const geometry = pieceGeometries[piece.type];
            const material = piece.color === 'white' ? whiteMaterial : blackMaterial;
            
            const mesh = new THREE.Mesh(geometry, material.clone());
            
            // Convert chess coordinates to 3D position
            const x = piece.position[0] * squareSize - (boardSize * squareSize) / 2 + squareSize / 2;
            const z = piece.position[1] * squareSize - (boardSize * squareSize) / 2 + squareSize / 2;
            
            mesh.position.set(x, 0.5, z);
            mesh.castShadow = true;
            
            // Special effect for checkmated king
            if (piece.checkmated) {
                // Store original material for pulsing effect
                mesh.userData.originalColor = material.color.clone();
                mesh.userData.isCheckmated = true;
            }
            
            piecesGroup.add(mesh);
        });
        
        // Attack line to show checkmate - using custom shader for premium look
        const checkmateLine = new THREE.Group();
        boardGroup.add(checkmateLine);
        
        // Get positions for line
        const queenPos = new THREE.Vector3(
            4 * squareSize - (boardSize * squareSize) / 2 + squareSize / 2,
            0.5,
            5 * squareSize - (boardSize * squareSize) / 2 + squareSize / 2
        );
        
        const kingPos = new THREE.Vector3(
            1 * squareSize - (boardSize * squareSize) / 2 + squareSize / 2,
            0.5,
            0 * squareSize - (boardSize * squareSize) / 2 + squareSize / 2
        );
        
        // Create attack line with professional glow effect
        const lineMaterial = new THREE.LineDashedMaterial({
            color: 0xbb3333,
            linewidth: 2,
            scale: 1,
            dashSize: 0.2,
            gapSize: 0.1,
            opacity: 0.7,
            transparent: true
        });
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(queenPos.x, 0.5, queenPos.z),
            new THREE.Vector3(kingPos.x, 0.5, kingPos.z)
        ]);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.computeLineDistances(); // Required for dashed lines
        checkmateLine.add(line);
        
        // Add victory particle effect
        const particleGroup = new THREE.Group();
        boardGroup.add(particleGroup);
        
        // Particles around checkmated king for dramatic effect
        for (let i = 0; i < 5; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.04, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0xbb3333,
                transparent: true,
                opacity: 0.7
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position around king
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.3 + Math.random() * 0.2;
            
            particle.position.x = kingPos.x + Math.cos(angle) * radius;
            particle.position.y = 0.5;
            particle.position.z = kingPos.z + Math.sin(angle) * radius;
            
            // Unique animation for each particle
            particle.userData = {
                angle: angle,
                radius: radius,
                speed: 0.01 + Math.random() * 0.02,
                amplitude: 0.1 + Math.random() * 0.1,
                phase: Math.random() * Math.PI * 2
            };
            
            particleGroup.add(particle);
        }
        
        // Rotate board for better perspective
        boardGroup.rotation.y = Math.PI / 6;
        
        // Professional animation loop
        const clock = new THREE.Clock();
        
        function animate() {
            requestAnimationFrame(animate);
            
            const delta = clock.getDelta();
            const time = clock.getElapsedTime();
            
            // Subtle board animation
            boardGroup.rotation.y = Math.PI / 6 + Math.sin(time * 0.2) * 0.05;
            
            // Particle animations
            particleGroup.children.forEach(particle => {
                const data = particle.userData;
                particle.position.y = kingPos.y + Math.sin(time * data.speed + data.phase) * data.amplitude;
                
                // Spiral movement
                particle.position.x = kingPos.x + Math.cos(data.angle + time * data.speed) * data.radius;
                particle.position.z = kingPos.z + Math.sin(data.angle + time * data.speed) * data.radius;
                
                // Fade in/out
                particle.material.opacity = 0.5 + Math.sin(time * 2 + data.phase) * 0.3;
            });
            
            // Checkmate effect - pulsing red for checkmated king
            piecesGroup.children.forEach(piece => {
                if (piece.userData.isCheckmated) {
                    const intensity = (Math.sin(time * 2) * 0.5 + 0.5);
                    piece.material.color.setRGB(
                        0.3 + intensity * 0.2,
                        0.3 - intensity * 0.2,
                        0.3 - intensity * 0.2
                    );
                    
                    // Subtle shaking
                    piece.position.x = kingPos.x + Math.sin(time * 15) * 0.02;
                    piece.position.z = kingPos.z + Math.cos(time * 15) * 0.02;
                }
            });
            
            // Line animation
            line.material.dashOffset = time * 0.5;
            
            renderer.render(scene, camera);
        }
        
        // Start animation
        animate();
        
        // Handle window resize - professional responsive behavior
        function handleResize() {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
        
        window.addEventListener('resize', handleResize);
        
        // Interactive camera movement on mousemove for premium feel
        document.querySelector('.premium-chess-container').addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Smooth camera adjustment
            camera.position.x = 5 + x * 0.5;
            camera.position.z = 7 + y * 0.5;
            camera.lookAt(3.5, 0, 3.5);
        });
    }
});

// Add this to your script.js file to handle the reveal animation

document.addEventListener('DOMContentLoaded', function() {
    // Process reveal sequences
    const revealSequences = document.querySelectorAll('.reveal-sequence');
    
    function revealElements() {
        revealSequences.forEach(sequence => {
            if (isElementInViewport(sequence)) {
                const delay = parseInt(sequence.getAttribute('data-delay') || 0);
                const items = sequence.querySelectorAll('.reveal-item');
                
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, delay + (index * 150)); // Staggered animation with 150ms between items
                });
            }
        });
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }
    
    // Initial check
    setTimeout(revealElements, 500); // Slight delay for page load
    
    // Check on scroll
    window.addEventListener('scroll', revealElements);
}); 