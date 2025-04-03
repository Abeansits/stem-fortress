// boss.js - Handles boss monster functionality and attack questions

class Boss {
    constructor(maxHealth = 20) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.attackCards = []; // Questions to ask the player
        this.currentAttackCard = null;
    }
    
    // Initialize boss attack cards (questions) based on the available stems
    initializeAttackCards(availableStems) {
        this.attackCards = [];
        
        availableStems.forEach(stem => {
            // Create different types of questions for each stem
            
            // Question Type 1: What does the stem mean?
            this.attackCards.push({
                stem: stem.stem,
                questionType: 'meaning',
                question: `What does the stem "${stem.stem}" mean?`,
                correctAnswer: stem.meaning,
                options: [] // Will be filled at question time to ensure fresh random options
            });
            
            // Question Type 2: What word uses this stem?
            if (stem.example && stem.example !== "") {
                this.attackCards.push({
                    stem: stem.stem,
                    questionType: 'example',
                    question: `Which word uses the stem "${stem.stem}"?`,
                    correctAnswer: stem.example,
                    options: []
                });
            }
            
            // Question Type 3: What does the example word mean?
            if (stem.example && stem.example !== "" && stem.exampleMeaning && stem.exampleMeaning !== "") {
                this.attackCards.push({
                    stem: stem.stem,
                    questionType: 'exampleMeaning',
                    question: `What does the word "${stem.example}" mean?`,
                    correctAnswer: stem.exampleMeaning,
                    options: []
                });
            }
        });
        
        // Shuffle the attack cards
        this.shuffleAttackCards();
    }
    
    // Shuffle attack cards to randomize questions
    shuffleAttackCards() {
        this.attackCards.sort(() => 0.5 - Math.random());
    }
    
    // Draw a new attack card (question)
    drawAttackCard() {
        if (this.attackCards.length === 0) {
            console.error('No attack cards available');
            return null;
        }
        
        // Take the first card from the deck
        this.currentAttackCard = this.attackCards.shift();
        
        // Generate options including correct answer
        this.generateOptions(this.currentAttackCard);
        
        return this.currentAttackCard;
    }
    
    // Generate multiple choice options for a question
    generateOptions(attackCard) {
        // Get random incorrect options
        const incorrectOptions = dataManager.getRandomIncorrectOptions(
            attackCard.correctAnswer,
            attackCard.questionType,
            3 // Number of incorrect options (3 incorrect + 1 correct = 4 total)
        );
        
        // Combine correct and incorrect options
        const allOptions = [attackCard.correctAnswer, ...incorrectOptions];
        
        // Shuffle all options
        attackCard.options = this.shuffleArray(allOptions);
        
        return attackCard.options;
    }
    
    // Helper function to shuffle an array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Take damage from player
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        
        // Update health bar
        this.updateHealthBar();
        
        return this.health;
    }
    
    // Reset boss health to max
    resetHealth() {
        this.health = this.maxHealth;
        this.updateHealthBar();
    }
    
    // Update the boss health bar in the UI
    updateHealthBar() {
        const healthElement = document.getElementById('boss-health');
        const healthBarElement = document.getElementById('boss-health-bar');
        
        if (healthElement) {
            healthElement.textContent = this.health;
        }
        
        if (healthBarElement) {
            const healthPercentage = (this.health / this.maxHealth) * 100;
            healthBarElement.style.setProperty('--health-percentage', `${healthPercentage}%`);
        }
    }
}

// Create a boss instance
const boss = new Boss(); 