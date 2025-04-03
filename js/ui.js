// ui.js - Handles user interface updates and interactions

class UIManager {
    constructor() {
        this.screens = {
            start: document.getElementById('start-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen')
        };
        
        this.containers = {
            playerHand: document.getElementById('player-hand'),
            question: document.getElementById('question-container'),
            answerOptions: document.getElementById('answer-options'),
            feedback: document.getElementById('feedback-message')
        };
        
        this.elements = {
            questionText: document.getElementById('question-text'),
            bossHealth: document.getElementById('boss-health'),
            bossHealthBar: document.getElementById('boss-health-bar'),
            playerHealth: document.getElementById('player-health'),
            playerHealthBar: document.getElementById('player-health-bar'),
            resultTitle: document.getElementById('result-title'),
            resultMessage: document.getElementById('result-message'),
            deckCountValue: document.getElementById('deck-count-value'),
            discardCountValue: document.getElementById('discard-count-value'),
            backgroundMusic: document.getElementById('background-music'),
            muteButton: document.getElementById('mute-button'),
            muteIcon: document.querySelector('.mute-icon')
        };
        
        this.buttons = {
            start: document.getElementById('start-button'),
            merge: document.getElementById('merge-button'),
            endTurn: document.getElementById('end-turn-button'),
            playAgain: document.getElementById('play-again-button'),
            mute: document.getElementById('mute-button')
        };
        
        // Initialize background music state
        this.isMusicPlaying = false;
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    // Initialize UI event listeners
    initializeEventListeners() {
        // Start button click
        this.buttons.start.addEventListener('click', () => {
            // Start the background music when game starts
            this.playBackgroundMusic();
            gameController.startGame();
        });
        
        // Merge button click
        this.buttons.merge.addEventListener('click', () => {
            gameController.mergeSelectedCards();
        });
        
        // End turn button click
        this.buttons.endTurn.addEventListener('click', () => {
            gameController.endPlayerTurn();
        });
        
        // Play again button click
        this.buttons.playAgain.addEventListener('click', () => {
            gameController.resetGame();
        });
        
        // Mute button click
        if (this.buttons.mute) {
            this.buttons.mute.addEventListener('click', () => {
                this.toggleBackgroundMusic();
            });
        }
    }
    
    // Play background music
    playBackgroundMusic() {
        if (this.elements.backgroundMusic) {
            // Set initial volume
            this.elements.backgroundMusic.volume = 0.5;
            
            // Play the music
            const playPromise = this.elements.backgroundMusic.play();
            
            // Handle autoplay restrictions
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    this.isMusicPlaying = true;
                }).catch(error => {
                    // Auto-play was prevented
                    console.log("Autoplay prevented:", error);
                    // Update the mute icon to show music is muted
                    this.updateMuteIcon(false);
                    this.isMusicPlaying = false;
                });
            }
        }
    }
    
    // Toggle background music
    toggleBackgroundMusic() {
        if (!this.elements.backgroundMusic) return;
        
        if (this.isMusicPlaying) {
            // Pause the music
            this.elements.backgroundMusic.pause();
            this.isMusicPlaying = false;
        } else {
            // Play the music
            this.elements.backgroundMusic.play();
            this.isMusicPlaying = true;
        }
        
        // Update the mute icon
        this.updateMuteIcon(this.isMusicPlaying);
    }
    
    // Update the mute button icon
    updateMuteIcon(isPlaying) {
        if (this.elements.muteIcon) {
            this.elements.muteIcon.textContent = isPlaying ? '🔊' : '🔇';
        }
    }
    
    // Show a specific screen and hide others
    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show the requested screen
        if (this.screens[screenName]) {
            this.screens[screenName].classList.remove('hidden');
        }
    }
    
    // Update the player's hand display
    updatePlayerHand(hand) {
        // Clear the current hand
        this.containers.playerHand.innerHTML = '';
        
        // Add each card to the hand container
        hand.forEach(card => {
            const cardElement = card.createCardElement();
            this.containers.playerHand.appendChild(cardElement);
        });
        
        // Update card counts
        this.updateCardCounts();
    }
    
    // Update the deck and discard pile counts
    updateCardCounts() {
        if (this.elements.deckCountValue) {
            this.elements.deckCountValue.textContent = player.deck.length;
        }
        
        if (this.elements.discardCountValue) {
            this.elements.discardCountValue.textContent = player.discardPile.length;
        }
    }
    
    // Show a question with multiple choice options
    showQuestion(attackCard) {
        // Set question text
        this.elements.questionText.textContent = attackCard.question;
        
        // Clear previous options
        this.containers.answerOptions.innerHTML = '';
        
        // Add each answer option
        attackCard.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option';
            optionElement.dataset.value = option;
            optionElement.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
            
            // Add click event
            optionElement.addEventListener('click', () => {
                this.onAnswerOptionClick(optionElement, attackCard.correctAnswer);
            });
            
            this.containers.answerOptions.appendChild(optionElement);
        });
        
        // Show the question container
        this.containers.question.classList.remove('hidden');
        
        // Highlight cards that match the question stem
        this.highlightMatchingCards(attackCard.stem);
    }
    
    // Highlight cards that match the current question's stem
    highlightMatchingCards(questionStem) {
        // Get all cards in the player's hand
        const cardElements = document.querySelectorAll('#player-hand .card');
        
        // Reset all card highlights
        cardElements.forEach(card => {
            card.classList.remove('matching-stem');
        });
        
        // Highlight cards with matching stem
        cardElements.forEach(card => {
            if (card.dataset.stem === questionStem) {
                card.classList.add('matching-stem');
            }
        });
    }
    
    // Handle answer option click
    onAnswerOptionClick(optionElement, correctAnswer) {
        // Only process if the game is awaiting answer selection
        if (!gameState.isAwaitingAnswerSelection) return;
        
        // Get selected answer
        const selectedAnswer = optionElement.dataset.value;
        
        // Deselect any previously selected option
        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => option.classList.remove('selected'));
        
        // Select this option
        optionElement.classList.add('selected');
        
        // Set the selected answer in the game state
        gameState.selectedAnswer = selectedAnswer;
        
        // Enable the end turn button
        this.buttons.endTurn.disabled = false;
    }
    
    // Hide the question container
    hideQuestion() {
        this.containers.question.classList.add('hidden');
    }
    
    // Update health displays
    updateHealthDisplays() {
        // Update boss health
        if (this.elements.bossHealth) {
            this.elements.bossHealth.textContent = boss.health;
        }
        
        if (this.elements.bossHealthBar) {
            const bossHealthPercentage = (boss.health / boss.maxHealth) * 100;
            this.elements.bossHealthBar.style.setProperty('--health-percentage', `${bossHealthPercentage}%`);
        }
        
        // Update player health
        if (this.elements.playerHealth) {
            this.elements.playerHealth.textContent = player.health;
        }
        
        if (this.elements.playerHealthBar) {
            const playerHealthPercentage = (player.health / player.maxHealth) * 100;
            this.elements.playerHealthBar.style.setProperty('--health-percentage', `${playerHealthPercentage}%`);
        }
    }
    
    // Update the merge button state based on mergeable cards
    updateMergeButton(hasMergeablePairs) {
        this.buttons.merge.disabled = !hasMergeablePairs;
    }
    
    // Show the result screen with win/lose information
    showResult(isVictory) {
        // Set result title and message
        if (isVictory) {
            this.elements.resultTitle.textContent = 'Victory!';
            this.elements.resultMessage.textContent = 'You\'ve defeated the boss and defended the Word Realm!';
        } else {
            this.elements.resultTitle.textContent = 'Defeat';
            this.elements.resultMessage.textContent = 'The boss has defeated you. Better luck next time!';
        }
        
        // Show the result screen
        this.showScreen('result');
    }
    
    // Show a temporary feedback message
    showFeedback(message, isPositive = true, duration = 2000) {
        // Set message and style
        this.containers.feedback.textContent = message;
        this.containers.feedback.className = isPositive ? 'feedback positive' : 'feedback negative';
        
        // Show the message
        this.containers.feedback.classList.remove('hidden');
        
        // Hide after duration
        setTimeout(() => {
            this.containers.feedback.classList.add('hidden');
        }, duration);
    }
}

// Create a UI manager instance
const uiManager = new UIManager(); 