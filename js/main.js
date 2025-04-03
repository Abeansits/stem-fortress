// main.js - Entry point for the game

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('Initializing Stem Guardians game...');
        
        // Initialize the game
        await gameController.initialize();
        
        // Set up initial music state
        setupMusicInteraction();
        
        console.log('Game initialization complete!');
    } catch (error) {
        console.error('Error starting the game:', error);
    }
});

// Setup music interaction to handle autoplay restrictions
function setupMusicInteraction() {
    // Many browsers require user interaction before playing audio
    // This allows the mute button to work immediately
    const backgroundMusic = document.getElementById('background-music');
    
    if (backgroundMusic) {
        // Set volume to 0 initially
        backgroundMusic.volume = 0;
        
        // Try to load the audio (without playing)
        backgroundMusic.load();
        
        // Add a one-time click listener to the document
        document.addEventListener('click', function initialInteraction() {
            // Now we can "play" the audio (even though it's muted)
            // This establishes the audio context in response to user interaction
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Pause immediately (we just want to establish the audio context)
                    backgroundMusic.pause();
                    // Reset volume for actual playback later
                    backgroundMusic.volume = 0.5;
                }).catch(error => {
                    console.log("Initial audio interaction failed:", error);
                });
            }
            
            // Remove this listener after first interaction
            document.removeEventListener('click', initialInteraction);
        }, { once: true });
    }
} 