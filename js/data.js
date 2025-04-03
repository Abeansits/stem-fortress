// data.js - Handles loading and processing stem data

class DataManager {
    constructor() {
        this.stems = [];
        this.isLoaded = false;
    }

    // Load stem data from JSON file
    async loadStemData() {
        try {
            const response = await fetch('stems.json');
            if (!response.ok) {
                throw new Error('Failed to load stem data');
            }
            
            this.stems = await response.json();
            
            // Update stems with power levels
            this.assignPowerLevels();
            
            this.isLoaded = true;
            return this.stems;
        } catch (error) {
            console.error('Error loading stem data:', error);
            return [];
        }
    }

    // Assign power levels to stems based on complexity (length or other factors)
    assignPowerLevels() {
        this.stems.forEach(stem => {
            // Simple algorithm: 
            // 1. Base power level on stem length (longer stems are more complex)
            // 2. Add some randomness for variety
            const basePower = Math.min(Math.ceil(stem.stem.length / 2), 3);
            const randomFactor = Math.floor(Math.random() * 3); // 0, 1, or 2
            
            stem.powerLevel = Math.min(Math.max(basePower + randomFactor, 1), 5); // Ensure between 1-5
            
            // Add example and meaning if missing (seems like they are in the data structure)
            if (!stem.example || stem.example === "") {
                stem.example = this.generateExample(stem.stem, stem.meaning);
            }
            
            if (!stem.exampleMeaning || stem.exampleMeaning === "") {
                stem.exampleMeaning = this.generateExampleMeaning(stem.example, stem.meaning);
            }
        });
    }
    
    // Generate an example word for stems missing examples
    generateExample(stem, meaning) {
        // This is a simple placeholder. In a real implementation, you'd have a more
        // sophisticated way of generating valid words from stems
        const commonEndings = ['ation', 'ity', 'ology', 'ize', 'ist', 'al', 'ing', 'ed'];
        const randomEnding = commonEndings[Math.floor(Math.random() * commonEndings.length)];
        return stem + randomEnding;
    }
    
    // Generate a meaning for example words missing meanings
    generateExampleMeaning(example, stemMeaning) {
        // Simple placeholder
        return `Related to ${stemMeaning}`;
    }

    // Get a random subset of stems
    getRandomStems(count) {
        if (!this.isLoaded || this.stems.length === 0) {
            console.error('Stem data not loaded yet');
            return [];
        }
        
        // Shuffle the stems array and return the first 'count' items
        return [...this.stems]
            .sort(() => 0.5 - Math.random())
            .slice(0, count);
    }
    
    // Get random incorrect options for a multiple choice question
    getRandomIncorrectOptions(correctOption, type, count = 3) {
        if (!this.isLoaded || this.stems.length === 0) {
            console.error('Stem data not loaded yet');
            return [];
        }
        
        // Filter out the correct option
        let possibleOptions;
        
        switch (type) {
            case 'meaning':
                // Get random meanings that are different from the correct one
                possibleOptions = this.stems
                    .filter(stem => stem.meaning !== correctOption)
                    .map(stem => stem.meaning);
                break;
                
            case 'example':
                // Get random examples that are different from the correct one
                possibleOptions = this.stems
                    .filter(stem => stem.example && stem.example !== correctOption)
                    .map(stem => stem.example);
                break;
                
            case 'exampleMeaning':
                // Get random example meanings that are different from the correct one
                possibleOptions = this.stems
                    .filter(stem => stem.exampleMeaning && stem.exampleMeaning !== correctOption)
                    .map(stem => stem.exampleMeaning);
                break;
                
            default:
                console.error('Invalid option type');
                return [];
        }
        
        // Shuffle and get the first 'count' items
        return [...new Set(possibleOptions)] // Remove duplicates
            .sort(() => 0.5 - Math.random())
            .slice(0, count);
    }
}

// Create a single instance of DataManager to be used throughout the app
const dataManager = new DataManager(); 