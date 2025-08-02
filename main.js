import * as THREE from 'three';

// Three.js 3D Background Setup
class Background3D {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('bg-canvas'),
            alpha: true,
            antialias: true
        });
        
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Setup camera
        this.camera.position.z = 5;
        
        // Create particles
        this.createParticles();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
    }
    
    createParticles() {
        // Create stars (particles)
        const starCount = 200;
        const starGeometry = new THREE.SphereGeometry(0.01, 8, 8);
        const starMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        for (let i = 0; i < starCount; i++) {
            const star = new THREE.Mesh(starGeometry, starMaterial);
            
            // Random position in space
            star.position.x = (Math.random() - 0.5) * 30;
            star.position.y = (Math.random() - 0.5) * 30;
            star.position.z = (Math.random() - 0.5) * 30;
            
            // Random speed
            star.userData = {
                speedX: (Math.random() - 0.5) * 0.005,
                speedY: (Math.random() - 0.5) * 0.005,
                speedZ: (Math.random() - 0.5) * 0.005,
                originalX: star.position.x,
                originalY: star.position.y,
                originalZ: star.position.z,
                twinkle: Math.random() * Math.PI * 2
            };
            
            this.particles.push(star);
            this.scene.add(star);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Animate stars and moons
        this.particles.forEach(particle => {
            if (particle.userData.twinkle !== undefined) {
                // Animate stars with twinkling effect
                particle.userData.twinkle += 0.05;
                particle.material.opacity = 0.3 + Math.sin(particle.userData.twinkle) * 0.5;
                
                particle.position.x += particle.userData.speedX;
                particle.position.y += particle.userData.speedY;
                particle.position.z += particle.userData.speedZ;
                
                // Reset position if star goes too far
                if (Math.abs(particle.position.x) > 15) {
                    particle.position.x = particle.userData.originalX;
                }
                if (Math.abs(particle.position.y) > 15) {
                    particle.position.y = particle.userData.originalY;
                }
                if (Math.abs(particle.position.z) > 15) {
                    particle.position.z = particle.userData.originalZ;
                }
            }
            
            // Rotate particle
            particle.rotation.x += 0.01;
            particle.rotation.y += 0.01;
        });
        
        // Camera movement based on mouse
        this.camera.position.x += (this.mouseX * 0.001 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.001 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    addEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX - window.innerWidth / 2;
            this.mouseY = event.clientY - window.innerHeight / 2;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Mouse Follower
class MouseFollower {
    constructor() {
        this.follower = document.querySelector('.mouse-follower');
        this.mouseX = 0;
        this.mouseY = 0;
        this.followerX = 0;
        this.followerY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        this.animate();
    }
    
    animate() {
        // Smooth following effect
        this.followerX += (this.mouseX - this.followerX) * 0.1;
        this.followerY += (this.mouseY - this.followerY) * 0.1;
        
        this.follower.style.left = this.followerX + 'px';
        this.follower.style.top = this.followerY + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

// Smooth Scrolling
class SmoothScroller {
    constructor() {
        this.init();
    }
    
    init() {
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Interactive Elements
class InteractiveElements {
    constructor() {
        this.init();
    }
    
    init() {
        // Add parallax effect to sections
        this.addParallaxEffect();
        
        // Add hover effects to cards
        this.addCardEffects();
        
        // Add button interactions
        this.addButtonInteractions();
        
        // Add floating icon interactions
        this.addFloatingIconInteractions();
    }
    
    addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.cat-container, .floating-elements');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    addCardEffects() {
        const cards = document.querySelectorAll('.about-card, .tokenomics-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    addButtonInteractions() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Realistic sponge squeeze effect
        const spongeBtn = document.querySelector('.sponge-button');
        if (spongeBtn) {
            const waterDrops = spongeBtn.querySelector('.water-drops');
            
            spongeBtn.addEventListener('mousedown', (e) => {
                // Create multiple water drops on press
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.createWaterDrop(spongeBtn, e);
                    }, i * 50);
                }
            });
            
            spongeBtn.addEventListener('mouseenter', () => {
                // Add subtle bounce effect
                spongeBtn.style.animation = 'spongeDeform 0.6s ease-in-out';
            });
            
            spongeBtn.addEventListener('mouseleave', () => {
                // Reset animation
                spongeBtn.style.animation = '';
            });
        }
    }
    
    createWaterDrop(button, event) {
        const drop = document.createElement('div');
        drop.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 4}px;
            height: ${Math.random() * 6 + 4}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(173, 216, 230, 0.6) 50%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: waterDrop 1.2s ease-out forwards;
        `;
        
        // Position based on click or random
        const rect = button.getBoundingClientRect();
        let x, y;
        
        if (event) {
            // Use click position
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        } else {
            // Random position
            x = Math.random() * rect.width;
            y = Math.random() * rect.height;
        }
        
        // Add some randomness to the position
        x += (Math.random() - 0.5) * 20;
        y += (Math.random() - 0.5) * 20;
        
        drop.style.left = x + 'px';
        drop.style.top = y + 'px';
        
        const waterDrops = button.querySelector('.water-drops');
        if (waterDrops) {
            waterDrops.appendChild(drop);
        } else {
            button.appendChild(drop);
        }
        
        setTimeout(() => {
            drop.remove();
        }, 1200);
    }
    
    // Sound functions removed
    
    addFloatingIconInteractions() {
        const icons = document.querySelectorAll('.floating-icon');
        
        icons.forEach(icon => {
            icon.addEventListener('click', () => {
                // Add click animation
                icon.style.transform = 'scale(1.5) rotate(180deg)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            });
        });
    }
}

// Number Animation
class NumberAnimator {
    constructor() {
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumbers(entry.target);
                }
            });
        }, observerOptions);
        
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(number => {
            observer.observe(number);
        });
    }
    
    animateNumbers(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
}

// Intersection Observer for animations
class AnimationObserver {
    constructor() {
        this.init();
    }
    
    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.cat-card, .hero-title, .hero-subtitle, .about-card, .tokenomics-card');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
}

// Global scroll function
window.scrollToSection = function(sectionId) {
    const section = document.querySelector(`#${sectionId}`);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// Sound removed

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D background
    new Background3D();
    
    // Initialize mouse follower
    new MouseFollower();
    
    // Initialize smooth scrolling
    new SmoothScroller();
    
    // Initialize interactive elements
    new InteractiveElements();
    
    // Initialize number animator
    new NumberAnimator();
    
    // Initialize animation observer
    new AnimationObserver();
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    body.loaded .hero-text,
    body.loaded .hero-visual {
        animation: fadeInUp 1s ease-out;
    }
`;
document.head.appendChild(style); 