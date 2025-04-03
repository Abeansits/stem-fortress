// game.js - Handles game state and main game logic

// Game state object to track current game status
const gameState = {
    // Game status
    isGameActive: false,
    
    // Turn state
    isPlayerTurn: false,
    isAwaitingCardSelection: false,
    isAwaitingAnswerSelection: false,
    
    // Selected elements
    selectedCard: null,
    selectedAnswer: null,
    currentQuestion: null,
    
    // Track available merges
    mergeablePairs: []
};

// Game controller to manage the gameplay
class GameController {
    constructor() {
        this.soundEffects = {
            correct: new Audio('assets/correct.mp3'),
            incorrect: new Audio('assets/incorrect.mp3'),
            merge: new Audio('assets/merge.mp3'),
            victory: new Audio('assets/victory.mp3'),
            defeat: new Audio('assets/defeat.mp3')
        };
        
        // Use placeholders if audio files don't exist yet
        for (const key in this.soundEffects) {
            this.soundEffects[key].onerror = () => {
                console.warn(`Audio file for ${key} not found. Using placeholder.`);
                // Create a simple placeholder for sound effects
                this.soundEffects[key] = {
                    play: () => console.log(`Playing sound: ${key}`)
                };
            };
        }
    }
    
    // Initialize the game
    async initialize() {
        try {
            // Load stem data
            await dataManager.loadStemData();
            
            // Initialize animations
            animationManager.initialize();
            
            // Show start screen
            uiManager.showScreen('start');
        } catch (error) {
            console.error('Error initializing game:', error);
        }
    }
    
    // Start a new game
    startGame() {
        // Reset game state
        gameState.isGameActive = true;
        gameState.isPlayerTurn = false;
        gameState.selectedCard = null;
        gameState.selectedAnswer = null;
        gameState.currentQuestion = null;
        
        // Reset player and boss
        player.resetHealth();
        boss.resetHealth();
        
        // Initialize player deck
        player.initializeDeck(10);
        player.dealInitialHand(5);
        
        // Initialize boss attack cards
        boss.initializeAttackCards(dataManager.stems);
        
        // Update UI
        uiManager.updatePlayerHand(player.hand);
        uiManager.updateCardCounts();
        uiManager.showScreen('game');
        
        // Start the first turn (boss goes first)
        this.startBossTurn();
    }
    
    // Start the boss's turn
    startBossTurn() {
        gameState.isPlayerTurn = false;
        gameState.isAwaitingCardSelection = false;
        gameState.isAwaitingAnswerSelection = false;
        
        // Draw an attack card (question)
        const attackCard = boss.drawAttackCard();
        if (!attackCard) {
            console.error('No attack cards available');
            return;
        }
        
        gameState.currentQuestion = attackCard;
        
        // Display the question to the player
        uiManager.showQuestion(attackCard);
        
        // Allow the player to select a card and answer
        gameState.isAwaitingCardSelection = true;
        gameState.isAwaitingAnswerSelection = true;
        
        // Check for mergeable cards
        this.checkForMergePossibility();
    }
    
    // Start the player's turn
    startPlayerTurn() {
        gameState.isPlayerTurn = true;
        
        // Draw a card if the deck is not empty
        if (player.deck.length > 0 || player.discardPile.length > 0) {
            const newCard = player.drawCard();
            if (newCard) {
                uiManager.updatePlayerHand(player.hand);
                uiManager.updateCardCounts();
            }
        }
        
        // Check for mergeable cards
        this.checkForMergePossibility();
    }
    
    // End the player's turn and process the answer
    endPlayerTurn() {
        if (!gameState.selectedCard || !gameState.selectedAnswer) {
            uiManager.showFeedback('You must select a card and an answer', false);
            return;
        }
        
        // Get selected card and answer
        const selectedCard = gameState.selectedCard;
        const selectedAnswer = gameState.selectedAnswer;
        const question = gameState.currentQuestion;
        
        // Check if the answer is correct
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        if (isCorrect) {
            // Correct answer: player attacks boss
            this.processCorrectAnswer(selectedCard, question);
        } else {
            // Incorrect answer: boss attacks player
            this.processIncorrectAnswer();
        }
    }
    
    // Process correct answer
    processCorrectAnswer(selectedCard, question) {
        // Play correct sound effect
        this.soundEffects.correct.play();
        
        // Find selected card in the hand
        const cardIndex = player.hand.findIndex(card => card === selectedCard);
        if (cardIndex === -1) {
            console.error('Selected card not found in hand');
            return;
        }
        
        // Remove card from hand and calculate damage
        const { card, damage } = player.playCard(cardIndex, question.stem);
        
        // Show animation
        uiManager.showFeedback(`Correct! Dealing ${damage} damage.`, true);
        
        // Animate the player attack
        animationManager.animatePlayerAttack(() => {
            // Apply damage to boss
            boss.takeDamage(damage);
            
            // Update UI
            uiManager.updatePlayerHand(player.hand);
            uiManager.updateCardCounts();
            uiManager.hideQuestion();
            
            // Check win condition
            if (boss.health <= 0) {
                this.endGame(true); // Player wins
            } else {
                // Start next turn
                this.startBossTurn();
            }
        });
    }
    
    // Process incorrect answer
    processIncorrectAnswer() {
        // Play incorrect sound effect
        this.soundEffects.incorrect.play();
        
        // Boss deals damage (2 by default)
        const damage = 2;
        
        // Show feedback
        uiManager.showFeedback(`Incorrect! Taking ${damage} damage.`, false);
        
        // Animate boss attack
        animationManager.animateBossAttack(() => {
            // Apply damage to player
            player.takeDamage(damage);
            
            // Update UI
            uiManager.hideQuestion();
            
            // Check lose condition
            if (player.health <= 0) {
                this.endGame(false); // Player loses
            } else {
                // Start next turn
                this.startBossTurn();
            }
        });
    }
    
    // Check if mergeable cards are available in the player's hand
    checkForMergePossibility() {
        // Find mergeable pairs
        gameState.mergeablePairs = player.findMergeablePairs();
        
        // Update merge button state
        uiManager.updateMergeButton(gameState.mergeablePairs.length > 0);
        
        // For debugging
        console.log("Mergeable pairs:", gameState.mergeablePairs.length, gameState.mergeablePairs);
    }
    
    // Merge selected cards
    mergeSelectedCards() {
        if (gameState.mergeablePairs.length === 0) {
            uiManager.showFeedback('No cards available to merge', false);
            return;
        }
        
        console.log("Attempting to merge cards...");
        
        // For simplicity, just merge the first available pair
        const [card1, card2] = gameState.mergeablePairs[0];
        
        // Find indices of the cards
        const card1Index = player.hand.indexOf(card1);
        const card2Index = player.hand.indexOf(card2);
        
        if (card1Index === -1 || card2Index === -1) {
            console.error('Cards not found in hand');
            return;
        }
        
        console.log(`Merging cards at indices ${card1Index} and ${card2Index}`);
        
        // Play merge sound effect
        this.soundEffects.merge.play();
        
        // Animate the merge
        animationManager.animateCardMerge(() => {
            // Perform the merge
            const superCard = player.mergeCards(card1Index, card2Index);
            
            if (superCard) {
                // Show feedback
                uiManager.showFeedback(`Created a Super ${superCard.stem} Guardian!`, true);
                
                // Update UI
                uiManager.updatePlayerHand(player.hand);
                
                // Update mergeable pairs
                this.checkForMergePossibility();
            }
        });
    }
    
    // End the game
    endGame(isVictory) {
        gameState.isGameActive = false;
        
        // Play appropriate sound effect
        if (isVictory) {
            this.soundEffects.victory.play();
        } else {
            this.soundEffects.defeat.play();
        }
        
        // Show result screen
        uiManager.showResult(isVictory);
    }
    
    // Reset the game
    resetGame() {
        // Reset player state
        player.deck = [];
        player.hand = [];
        player.discardPile = []; // Clear discard pile
        
        // Show start screen
        uiManager.showScreen('start');
    }
}

// Create a game controller instance
const gameController = new GameController(); 