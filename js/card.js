// card.js - Handles card creation and functionality

class Card {
    constructor(data) {
        this.stem = data.stem;
        this.meaning = data.meaning;
        this.example = data.example;
        this.exampleMeaning = data.exampleMeaning;
        this.powerLevel = data.powerLevel || 1;
        this.isSuper = data.isSuper || false;
        this.element = null;
    }
    
    // Create the DOM element for the card
    createCardElement() {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${this.isSuper ? 'super-card' : ''}`;
        cardElement.dataset.stem = this.stem;
        
        // Card content structure
        cardElement.innerHTML = `
            <div class="card-image">
                <!-- Placeholder for card image -->
                <div style="font-size: 2rem; color: var(--vibrant-orange);">${this.stem.charAt(0).toUpperCase()}</div>
            </div>
            <div class="card-title">${this.stem} Guardian</div>
            <div class="card-meaning">Meaning: ${this.meaning}</div>
            <div class="card-example">Example: ${this.example}</div>
            <div class="card-power">${this.powerLevel}</div>
        `;
        
        // Add click event handler
        cardElement.addEventListener('click', () => this.onCardClick(cardElement));
        
        this.element = cardElement;
        return cardElement;
    }
    
    // Handle card click
    onCardClick(cardElement) {
        // Only allow selection if the game is awaiting card selection
        if (!gameState.isAwaitingCardSelection) return;
        
        // Deselect any previously selected card
        const selectedCard = document.querySelector('.card.selected');
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }
        
        // If clicking the same card, deselect it
        if (selectedCard === cardElement) {
            gameState.selectedCard = null;
        } else {
            // Select the new card
            cardElement.classList.add('selected');
            gameState.selectedCard = this;
        }
        
        // Check if merge is possible when cards are selected/deselected
        gameController.checkForMergePossibility();
    }
    
    // Merge this card with another card to create a Super card
    mergeWith(otherCard) {
        if (this.stem !== otherCard.stem) {
            console.error('Cannot merge cards with different stems');
            return null;
        }
        
        // Create a new Super card
        const superCard = new Card({
            stem: this.stem,
            meaning: this.meaning,
            example: this.example,
            exampleMeaning: this.exampleMeaning,
            powerLevel: Math.max(this.powerLevel, otherCard.powerLevel) + 2,
            isSuper: true
        });
        
        return superCard;
    }
    
    // Play this card (apply its effect)
    play(questionStem) {
        // Base damage is the card's power level
        let damage = this.powerLevel;
        
        // Bonus damage if the card's stem matches the question stem
        if (questionStem && this.stem === questionStem) {
            damage += 1;
        }
        
        // Special abilities for Super cards could be added here
        if (this.isSuper) {
            // Example: Super cards get an additional +1 damage
            damage += 1;
        }
        
        return damage;
    }
}

// Factory function to create player cards from stem data
function createPlayerCards(stemData, count = 5) {
    // Get random stems
    const randomStems = dataManager.getRandomStems(count);
    
    // Create Card objects from the stem data
    return randomStems.map(stemData => new Card(stemData));
} 