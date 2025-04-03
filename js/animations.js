// animations.js - Handles 3D animations with Three.js

class AnimationManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.bossModel = null;
        this.playerModel = null;
        this.isInitialized = false;
    }
    
    // Initialize the 3D scene
    initialize() {
        if (this.isInitialized) return;
        
        // Get container elements
        const bossContainer = document.getElementById('boss-model');
        const playerContainer = document.getElementById('player-model');
        
        if (!bossContainer || !playerContainer) {
            console.error('Boss or player container not found');
            return;
        }
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(bossContainer.clientWidth, bossContainer.clientHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        
        // Add to both containers
        bossContainer.appendChild(this.renderer.domElement.cloneNode(true));
        playerContainer.appendChild(this.renderer.domElement);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffa500, 0.8); // Orange light
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
        
        // Create boss model (placeholder cube for now)
        const bossGeometry = new THREE.BoxGeometry(1, 1, 1);
        const bossMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8B0000, 
            emissive: 0x4B0082,
            shininess: 30
        });
        this.bossModel = new THREE.Mesh(bossGeometry, bossMaterial);
        this.bossModel.position.set(0, 0, 0);
        this.scene.add(this.bossModel);
        
        // Create player model (placeholder sphere for now)
        const playerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const playerMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFFA500, 
            emissive: 0xFF8C00,
            shininess: 30
        });
        this.playerModel = new THREE.Mesh(playerGeometry, playerMaterial);
        this.playerModel.position.set(0, -2, 0);
        this.scene.add(this.playerModel);
        
        // Start animation loop
        this.animate();
        
        this.isInitialized = true;
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    // Animation loop
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate models slowly for visual interest
        if (this.bossModel) {
            this.bossModel.rotation.y += 0.01;
        }
        
        if (this.playerModel) {
            this.playerModel.rotation.y += 0.01;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Handle window resize
    onWindowResize() {
        const bossContainer = document.getElementById('boss-model');
        const playerContainer = document.getElementById('player-model');
        
        if (!bossContainer || !playerContainer || !this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(bossContainer.clientWidth, bossContainer.clientHeight);
    }
    
    // Player attack animation
    animatePlayerAttack(callback) {
        if (!this.playerModel || !this.bossModel) return;
        
        // Store original position
        const originalPosition = this.playerModel.position.clone();
        
        // Animation timeline
        const startPosition = { x: originalPosition.x, y: originalPosition.y, z: originalPosition.z };
        const endPosition = { x: 0, y: 0, z: 0 }; // Move toward boss
        
        // Simple animation with requestAnimationFrame
        let startTime = null;
        const duration = 1000; // 1 second
        
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Move player model toward boss
            if (progress < 0.5) {
                // First half: move toward boss
                const moveProgress = progress * 2; // Scale to 0-1 for first half
                this.playerModel.position.x = startPosition.x + (endPosition.x - startPosition.x) * moveProgress;
                this.playerModel.position.y = startPosition.y + (endPosition.y - startPosition.y) * moveProgress;
            } else {
                // Second half: move back
                const moveProgress = (progress - 0.5) * 2; // Scale to 0-1 for second half
                this.playerModel.position.x = endPosition.x + (startPosition.x - endPosition.x) * moveProgress;
                this.playerModel.position.y = endPosition.y + (startPosition.y - endPosition.y) * moveProgress;
            }
            
            // Add a "hit" effect when reaching the boss
            if (progress >= 0.5 && progress <= 0.52) {
                this.bossModel.scale.set(1.3, 1.3, 1.3); // Expand briefly
            } else if (progress > 0.52) {
                this.bossModel.scale.set(1, 1, 1); // Return to normal size
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Reset position at end of animation
                this.playerModel.position.copy(originalPosition);
                
                // Call callback when animation completes
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(step);
    }
    
    // Boss attack animation
    animateBossAttack(callback) {
        if (!this.playerModel || !this.bossModel) return;
        
        // Store original position
        const originalPosition = this.bossModel.position.clone();
        
        // Animation timeline
        const startPosition = { x: originalPosition.x, y: originalPosition.y, z: originalPosition.z };
        const endPosition = { x: 0, y: -2, z: 0 }; // Move toward player
        
        // Simple animation with requestAnimationFrame
        let startTime = null;
        const duration = 1000; // 1 second
        
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Move boss model toward player
            if (progress < 0.5) {
                // First half: move toward player
                const moveProgress = progress * 2; // Scale to 0-1 for first half
                this.bossModel.position.x = startPosition.x + (endPosition.x - startPosition.x) * moveProgress;
                this.bossModel.position.y = startPosition.y + (endPosition.y - startPosition.y) * moveProgress;
            } else {
                // Second half: move back
                const moveProgress = (progress - 0.5) * 2; // Scale to 0-1 for second half
                this.bossModel.position.x = endPosition.x + (startPosition.x - endPosition.x) * moveProgress;
                this.bossModel.position.y = endPosition.y + (startPosition.y - endPosition.y) * moveProgress;
            }
            
            // Add a "hit" effect when reaching the player
            if (progress >= 0.5 && progress <= 0.52) {
                this.playerModel.scale.set(1.3, 1.3, 1.3); // Expand briefly
            } else if (progress > 0.52) {
                this.playerModel.scale.set(1, 1, 1); // Return to normal size
            }
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Reset position at end of animation
                this.bossModel.position.copy(originalPosition);
                
                // Call callback when animation completes
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(step);
    }
    
    // Card merge animation
    animateCardMerge(callback) {
        // This would typically operate on DOM elements since the cards are HTML/CSS
        // For now, we'll just add a simple visual effect in the 3D scene
        
        // Create a particle burst effect in the middle of the scene
        const particleCount = 50;
        const particles = new THREE.Group();
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.05, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xFFD700, // Gold color
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // Random starting position near center
            particle.position.set(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            );
            
            // Random velocity
            particle.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );
            
            particles.add(particle);
        }
        
        this.scene.add(particles);
        
        // Animation timeline
        let startTime = null;
        const duration = 1000; // 1 second
        
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Update particle positions
            particles.children.forEach(particle => {
                particle.position.add(particle.userData.velocity);
                particle.material.opacity = 0.8 * (1 - progress);
            });
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // Remove particles at end of animation
                this.scene.remove(particles);
                
                // Call callback when animation completes
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(step);
    }
}

// Create an animation manager instance
const animationManager = new AnimationManager(); 