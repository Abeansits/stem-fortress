// Game state
let stemsData = [];
let audioStarted = false;
let synth, hitSynth, powerUpSynth;
let currentQuestion = null;
let score = 0;
let lives = 3;
let gameInterval = null;
let monsterSpawnInterval = null;
let monsters = [];
let gameActive = false;
let consecutiveCorrect = 0;
let powerUpActive = false;
let powerUpTimeout = null;

// DOM Elements
let setupSection, gameSection, gameOverSection, stemForm, stemList, startGameButton;
let gameArea, scoreDisplay, livesDisplay, powerUpIndicator, qaSection;
let questionText, answerInput, submitAnswerButton, feedbackText;
let finalScoreDisplay, playAgainButton, messageBox, messageText, messageOkButton;
let stemInput, stemMeaningInput, exampleWordInput, wordMeaningInput, addStemButton;

// Initialize DOM elements
function initializeElements() {
    setupSection = document.getElementById('setup-section');
    gameSection = document.getElementById('game-section');
    gameOverSection = document.getElementById('game-over-section');
    stemForm = document.getElementById('stem-form');
    stemList = document.getElementById('stem-list');
    startGameButton = document.getElementById('start-game-button');
    gameArea = document.getElementById('game-area');
    scoreDisplay = document.getElementById('score');
    livesDisplay = document.getElementById('lives');
    powerUpIndicator = document.getElementById('power-up-indicator');
    qaSection = document.getElementById('qa-section');
    questionText = document.getElementById('question-text');
    answerInput = document.getElementById('answer-input');
    submitAnswerButton = document.getElementById('submit-answer-button');
    feedbackText = document.getElementById('feedback-text');
    finalScoreDisplay = document.getElementById('final-score');
    playAgainButton = document.getElementById('play-again-button');
    messageBox = document.getElementById('message-box');
    messageText = document.getElementById('message-text');
    messageOkButton = document.getElementById('message-ok-button');
    stemInput = document.getElementById('stem');
    stemMeaningInput = document.getElementById('stem-meaning');
    exampleWordInput = document.getElementById('example-word');
    wordMeaningInput = document.getElementById('word-meaning');
    addStemButton = document.getElementById('add-stem-button');

    // Validate essential elements
    if (!stemForm || !addStemButton || !stemInput || !stemMeaningInput || !exampleWordInput || !wordMeaningInput || !stemList || !startGameButton) {
        console.error("CRITICAL ERROR: One or more essential setup elements not found!");
        showMessage("A critical error occurred loading the setup form. Please reload the page.");
        return false;
    }
    return true;
}

// Audio Setup
function setupAudio() {
    if (typeof Tone !== 'undefined') {
        try {
            synth = new Tone.Synth().toDestination();
            hitSynth = new Tone.MembraneSynth().toDestination();
            powerUpSynth = new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination();
            console.log("Tone.js Synths created.");
        } catch(e) {
            console.error("Error creating Tone.js synths:", e);
        }
    } else {
        console.error("Tone is not defined. Audio will be disabled.");
    }
}

async function initAudio() {
    if (typeof Tone === 'undefined' || audioStarted) return;
    if (Tone.context.state !== 'running') {
        console.log("Attempting to start/resume Audio Context...");
        try {
            await Tone.start();
            console.log("Audio Context state:", Tone.context.state);
            audioStarted = (Tone.context.state === 'running');
        } catch (e) {
            console.error("Error starting Audio Context:", e);
            audioStarted = false;
        }
    } else {
        audioStarted = true;
    }
}

// Sound Functions
function playSound(note, duration = '8n') {
    if (!audioStarted || !synth) return;
    try {
        synth.triggerAttackRelease(note, duration);
    } catch (e) {
        console.error("Sound error:", e);
    }
}

function playHitSound() {
    if (!audioStarted || !hitSynth) return;
    try {
        hitSynth.triggerAttackRelease("C2", "16n");
    } catch (e) {
        console.error("Hit sound error:", e);
    }
}

function playPowerUpSound() {
    if (!audioStarted || !powerUpSynth) return;
    try {
        powerUpSynth.triggerAttackRelease("G5", "8n", Tone.now());
        powerUpSynth.triggerAttackRelease("C6", "8n", Tone.now() + 0.1);
    } catch (e) {
        console.error("Powerup sound error:", e);
    }
}

function playGameOverSound() {
    if (!audioStarted || !synth) return;
    try {
        synth.triggerAttackRelease("C3", "4n", Tone.now());
        synth.triggerAttackRelease("G2", "4n", Tone.now() + 0.3);
        synth.triggerAttackRelease("E2", "2n", Tone.now() + 0.6);
    } catch (e) {
        console.error("Game over sound error:", e);
    }
}

// Utility Functions
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showMessage(message) {
    if (messageText && messageBox) {
        messageText.textContent = message;
        messageBox.classList.remove('hidden');
    } else {
        console.error("Cannot show message box.");
    }
}

function hideMessage() {
    if (messageBox) {
        messageBox.classList.add('hidden');
    }
}

function updateStemList() {
    if (!stemList) {
        console.error("stemList element not found.");
        return;
    }
    stemList.innerHTML = '';
    stemsData.forEach((data, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${data.stem} (${data.stemMeaning}) -> ${data.word} (${data.wordMeaning})`;
        li.classList.add('mb-1', 'text-sm');
        stemList.appendChild(li);
    });
}

// Game Functions
function updateDisplay() {
    if (scoreDisplay) scoreDisplay.textContent = score;
    if (livesDisplay) livesDisplay.textContent = lives;
}

function startGame() {
    console.log("Game Started");
    score = 0;
    lives = 3;
    gameActive = true;
    updateDisplay();
    clearGameArea();
    askQuestion();
    clearIntervals();
    monsterSpawnInterval = setInterval(spawnMonster, 3000);
    gameInterval = setInterval(gameLoop, 50);
    playSound("C5", "4n");
}

function gameLoop() {
    if (!gameActive) return;
    moveMonsters();
}

function spawnMonster() {
    if (!gameActive || !gameArea) return;
    const monster = document.createElement('div');
    monster.classList.add('monster', 'game-font');
    monster.textContent = 'X_X';
    const gameAreaWidth = gameArea.offsetWidth;
    monster.style.left = `${getRandomInt(0, Math.max(0, gameAreaWidth - 40))}px`;
    monster.style.top = `10px`;
    gameArea.appendChild(monster);
    monsters.push(monster);
}

function moveMonsters() {
    if (!gameArea) return;
    const gameAreaHeight = gameArea.offsetHeight;
    for (let i = monsters.length - 1; i >= 0; i--) {
        const monster = monsters[i];
        if (!monster || !monster.parentNode) {
            monsters.splice(i, 1);
            continue;
        }
        let currentTop = parseInt(monster.style.top || 10);
        let speed = powerUpActive ? 4 : 2;
        currentTop += speed;
        if (currentTop >= gameAreaHeight - 60 - monster.offsetHeight) {
            gameArea.removeChild(monster);
            monsters.splice(i, 1);
            loseLife();
            playHitSound();
        } else {
            monster.style.top = `${currentTop}px`;
        }
    }
}

function loseLife() {
    console.log("Life lost");
    lives--;
    updateDisplay();
    playSound("A3", "8n");
    if (lives <= 0) endGame();
}

function endGame() {
    console.log("Game Over");
    gameActive = false;
    clearIntervals();
    if(gameOverSection) gameOverSection.classList.remove('hidden');
    if(finalScoreDisplay) finalScoreDisplay.textContent = score;
    playGameOverSound();
}

function clearGameArea() {
    console.log("Game area cleared");
    if (!gameArea) return;
    monsters.forEach(m => {
        if(m.parentNode === gameArea) gameArea.removeChild(m);
    });
    monsters = [];
    const projectiles = gameArea.querySelectorAll('.projectile');
    projectiles.forEach(p => gameArea.removeChild(p));
}

function askQuestion() {
    if (stemsData.length === 0 || !gameActive || !questionText) return;
    const idx = getRandomInt(0, stemsData.length - 1);
    const info = stemsData[idx];
    const type = getRandomInt(1, 4);
    let q = "", a = "";
    
    switch (type) {
        case 1:
            q = `Meaning of stem "${info.stem}"?`;
            a = info.stemMeaning;
            break;
        case 2:
            q = `Stem meaning "${info.stemMeaning}"?`;
            a = info.stem;
            break;
        case 3:
            q = `Word using stem "${info.stem}"?`;
            a = info.word;
            break;
        case 4:
            q = `Stem in word "${info.word}"?`;
            a = info.stem;
            break;
    }
    
    currentQuestion = { question: q, answer: a };
    questionText.textContent = q;
    
    if(answerInput) {
        answerInput.value = '';
        answerInput.disabled = false;
        answerInput.focus();
    }
    if(submitAnswerButton) submitAnswerButton.disabled = false;
    if(feedbackText) feedbackText.textContent = '';
    
    console.log("Asking question:", q);
}

function checkAnswer() {
    if (!currentQuestion || !gameActive || !answerInput) return;
    initAudio();
    
    const userAns = answerInput.value.trim().toLowerCase();
    const correctAns = currentQuestion.answer.trim().toLowerCase();
    console.log(`Checking answer: User='${userAns}', Correct='${correctAns}'`);
    
    answerInput.disabled = true;
    if(submitAnswerButton) submitAnswerButton.disabled = true;
    
    if (userAns === correctAns) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer();
    }
    
    updateDisplay();
    setTimeout(() => {
        if (gameActive) askQuestion();
    }, 1500);
}

function handleCorrectAnswer() {
    console.log("Correct");
    score += 10;
    consecutiveCorrect++;
    
    if(feedbackText) {
        feedbackText.textContent = 'Correct!';
        feedbackText.className = 'mt-3 text-sm font-medium h-4 game-font text-green-400';
    }
    
    playSound("C5");
    if(gameArea) {
        gameArea.classList.add('correct-flash');
        setTimeout(() => {
            if(gameArea) gameArea.classList.remove('correct-flash');
        }, 500);
    }
    
    if (consecutiveCorrect >= 3 && !powerUpActive) {
        activatePowerUp();
    }
    
    if (monsters.length > 0 && gameArea) {
        const monsterToRemove = monsters.shift();
        if (monsterToRemove && monsterToRemove.parentNode === gameArea) {
            gameArea.removeChild(monsterToRemove);
        }
        playHitSound();
    }
}

function handleIncorrectAnswer() {
    console.log("Incorrect");
    consecutiveCorrect = 0;
    deactivatePowerUp();
    
    if(feedbackText) {
        feedbackText.textContent = `Nope! It's: ${currentQuestion.answer}`;
        feedbackText.className = 'mt-3 text-sm font-medium h-4 game-font text-red-400';
    }
    
    playSound("C4", "8n");
    if(gameArea) {
        gameArea.classList.add('incorrect-flash');
        setTimeout(() => {
            if(gameArea) gameArea.classList.remove('incorrect-flash');
        }, 500);
    }
    
    loseLife();
}

function activatePowerUp() {
    if (powerUpActive || !powerUpIndicator) return;
    console.log("Activating Power Up!");
    powerUpActive = true;
    powerUpIndicator.textContent = '⚡ POWER UP! ⚡';
    playPowerUpSound();
    clearInterval(monsterSpawnInterval);
    monsterSpawnInterval = setInterval(spawnMonster, 1500);
    clearTimeout(powerUpTimeout);
    powerUpTimeout = setTimeout(deactivatePowerUp, 10000);
}

function deactivatePowerUp() {
    if (!powerUpActive || !powerUpIndicator) return;
    console.log("Deactivating Power Up.");
    powerUpActive = false;
    powerUpIndicator.textContent = '';
    clearTimeout(powerUpTimeout);
    if (gameActive) {
        clearInterval(monsterSpawnInterval);
        monsterSpawnInterval = setInterval(spawnMonster, 3000);
    }
}

function clearIntervals() {
    clearInterval(gameInterval);
    clearInterval(monsterSpawnInterval);
    clearTimeout(powerUpTimeout);
}

// Event Handlers
function handleAddStem() {
    console.log("handleAddStem function called");
    initAudio();

    const stemVal = stemInput.value.trim();
    const stemMeaningVal = stemMeaningInput.value.trim();
    const exampleWordVal = exampleWordInput.value.trim();
    const wordMeaningVal = wordMeaningInput.value.trim();

    if (stemVal && stemMeaningVal && exampleWordVal && wordMeaningVal) {
        const newStem = {
            stem: stemVal,
            stemMeaning: stemMeaningVal,
            word: exampleWordVal,
            wordMeaning: wordMeaningVal
        };
        stemsData.push(newStem);
        updateStemList();
        stemForm.reset();
        stemInput.focus();
        startGameButton.disabled = false;
        playSound("C4");
    } else {
        showMessage("Please fill in all fields for the stem.");
    }
}

function handleStartGame() {
    console.log("Start game button clicked.");
    initAudio();
    if (stemsData.length > 0) {
        console.log("Starting game...");
        if (setupSection) setupSection.classList.add('hidden');
        if (gameOverSection) gameOverSection.classList.add('hidden');
        if (gameSection) gameSection.classList.remove('hidden');
        startGame();
    } else {
        console.log("Cannot start game, no stems added.");
        showMessage("Please add at least one stem before starting the game.");
    }
}

function handlePlayAgain() {
    console.log("Play Again clicked.");
    stemsData = [];
    updateStemList();
    if (startGameButton) startGameButton.disabled = true;
    if (gameOverSection) gameOverSection.classList.add('hidden');
    if (setupSection) setupSection.classList.remove('hidden');
    if (stemForm) stemForm.reset();
    if (stemInput) stemInput.focus();
    gameActive = false;
    clearIntervals();
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    
    if (!initializeElements()) return;
    setupAudio();
    
    // Add event listeners
    addStemButton.addEventListener('click', handleAddStem);
    startGameButton.addEventListener('click', handleStartGame);
    submitAnswerButton.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    playAgainButton.addEventListener('click', handlePlayAgain);
    messageOkButton.addEventListener('click', hideMessage);
    
    // Initial Setup
    updateDisplay();
    stemInput.focus();
    startGameButton.disabled = true;
    console.log("Initial setup complete. Waiting for user input.");
}); 