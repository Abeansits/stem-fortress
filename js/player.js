// player.js - Handles player functionality, health, and card deck

class Player {
    constructor(maxHealth = 20) {
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.deck = []; // Full deck of cards
        this.hand = []; // Cards in hand (e.g., 5 cards)
        this.discardPile = []; // Add a discard pile for played cards
    }
    
    // Initialize the player's deck with random stem cards
    initializeDeck(count = 10) {
        // Get random stems and create cards
        this.deck = createPlayerCards(dataManager.stems, count);
        
        // Shuffle the deck
        this.shuffleDeck();
        
        // Clear discard pile when initializing a new deck
        this.discardPile = [];
        
        return this.deck;
    }
    
    // Shuffle the deck
    shuffleDeck() {
        this.deck.sort(() => 0.5 - Math.random());
    }
    
    // Deal initial hand from the deck
    dealInitialHand(handSize = 5) {
        // Clear hand first
        this.hand = [];
        
        // Deal cards to the hand
        for (let i = 0; i < handSize && this.deck.length > 0; i++) {
            this.hand.push(this.deck.pop());
        }
        
        return this.hand;
    }
    
    // Draw a card from the deck to the hand
    drawCard() {
        // If deck is empty, recycle the discard pile
        if (this.deck.length === 0) {
            if (this.discardPile.length === 0) {
                console.warn('Both deck and discard pile are empty, cannot draw a card');
                return null;
            }
            
            console.log('Recycling discard pile into deck');
            this.deck = [...this.discardPile];
            this.discardPile = [];
            this.shuffleDeck();
            
            // Show feedback to the player about recycling
            uiManager.showFeedback('Reshuffling played cards into your deck!', true);
        }
        
        const card = this.deck.pop();
        this.hand.push(card);
        
        return card;
    }
    
    // Play a card from the hand
    playCard(cardIndex, questionStem) {
        if (cardIndex < 0 || cardIndex >= this.hand.length) {
            console.error('Invalid card index');
            return null;
        }
        
        // Remove the card from the hand
        const card = this.hand.splice(cardIndex, 1)[0];
        
        // Add card to discard pile
        this.discardPile.push(card);
        
        // Calculate damage amount
        const damage = card.play(questionStem);
        
        return { card, damage };
    }
    
    // Find mergeable cards in the hand (cards with the same stem)
    findMergeablePairs() {
        const stemCounts = {};
        
        // Count cards by stem
        this.hand.forEach(card => {
            if (!stemCounts[card.stem]) {
                stemCounts[card.stem] = [];
            }
            stemCounts[card.stem].push(card);
        });
        
        // Find stems with 2 or more cards
        const mergeablePairs = Object.values(stemCounts)
            .filter(cards => cards.length >= 2)
            .map(cards => [cards[0], cards[1]]);
        
        return mergeablePairs;
    }
    
    // Merge two cards in the hand
    mergeCards(card1Index, card2Index) {
        if (card1Index >= this.hand.length || card2Index >= this.hand.length || card1Index < 0 || card2Index < 0) {
            console.error('Invalid card indices for merging');
            return null;
        }
        
        // Ensure card1Index is the smaller index
        if (card1Index > card2Index) {
            [card1Index, card2Index] = [card2Index, card1Index];
        }
        
        const card1 = this.hand[card1Index];
        const card2 = this.hand[card2Index];
        
        // Check if the cards can be merged
        if (card1.stem !== card2.stem) {
            console.error('Cards must have the same stem to be merged');
            return null;
        }
        
        // Create the super card
        const superCard = card1.mergeWith(card2);
        
        // Remove the original cards (starting with the higher index to avoid shifting issues)
        this.hand.splice(card2Index, 1);
        this.hand.splice(card1Index, 1);
        
        // Add the super card to the hand
        this.hand.push(superCard);
        
        return superCard;
    }
    
    // Take damage from boss
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        
        // Update health bar
        this.updateHealthBar();
        
        return this.health;
    }
    
    // Reset player health to max
    resetHealth() {
        this.health = this.maxHealth;
        this.updateHealthBar();
    }
    
    // Update the player health bar in the UI
    updateHealthBar() {
        const healthElement = document.getElementById('player-health');
        const healthBarElement = document.getElementById('player-health-bar');
        
        if (healthElement) {
            healthElement.textContent = this.health;
        }
        
        if (healthBarElement) {
            const healthPercentage = (this.health / this.maxHealth) * 100;
            healthBarElement.style.setProperty('--health-percentage', `${healthPercentage}%`);
        }
    }
}

// Create a player instance
const player = new Player(); 