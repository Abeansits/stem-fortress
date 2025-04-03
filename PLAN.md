# Stem Guardians: Development Plan

## 1. Project Setup & Core Data
- [x] Set up project structure (HTML, CSS, JS folders).
- [x] Create the initial `index.html` file.
- [x] Create CSS file(s) for styling.
- [x] Create JavaScript file(s) for game logic.
- [x] Create the `stems.json` data file with initial stem data.
- [x] Implement JSON data loading and parsing logic.

## 2. Game Components Implementation
- [x] **Player Cards:**
    - [x] Define the Player Card data structure (object/class).
    - [x] Implement function to generate Player Cards from JSON data.
    - [x] Assign `powerLevel` based on stem complexity (define criteria).
- [x] **Boss Monster:**
    - [x] Define the Boss Monster data structure (object/class).
    - [x] Initialize Boss health.
    - [x] Define the Boss Attack Card (question) structure.
    - [x] Implement function to generate Boss Attack Cards (questions) from JSON data.
        - [x] Ensure generation of correct and incorrect multiple-choice options.
- [x] **Player:**
    - [x] Initialize Player health.
    - [x] Implement Player deck structure.
    - [x] Implement Player hand structure.

## 3. Gameplay Flow Logic
- [x] **Game Setup:**
    - [x] Implement initial health setup for Player and Boss.
    - [x] Implement Player deck creation from generated cards.
    - [x] Implement Boss attack card deck creation.
    - [x] Implement deck shuffling logic (Player and Boss).
    - [x] Implement dealing initial Player hand (e.g., 5 cards).
- [x] **Turn Sequence:**
    - [x] Implement overall turn management logic.
    - [x] **Boss's Turn:**
        - [x] Implement drawing a Boss attack card (question).
        - [x] Implement displaying the question and multiple-choice options.
    - [x] **Player's Turn:**
        - [x] Implement card selection from hand logic.
        - [x] Implement answer selection logic.
        - [x] Implement outcome logic (correct/incorrect answer).
            - [x] Apply damage to Boss on correct answer (consider bonus damage).
            - [x] Apply damage to Player on incorrect answer.
        - [x] Implement card drawing logic for the player (if applicable, e.g., draw one card per turn).
    - [x] **End of Turn:**
        - [x] Implement win condition check (Boss health <= 0).
        - [x] Implement lose condition check (Player health <= 0).
        - [x] Implement transition to the next turn.
- [x] **Winning and Losing:**
    - [x] Implement game end screen/state for winning.
    - [x] Implement game end screen/state for losing.
    - [x] Implement restart option.

## 4. Merge Mechanic
- [x] Implement logic to check for mergeable cards (same `stem`) in the player's hand.
- [x] Implement card merging functionality.
    - [x] Calculate new `powerLevel` for the "Super" card.
    - [x] Define and implement optional special abilities for merged cards.
    - [x] Update player's hand with the merged card.
- [x] Integrate merge option into the start of the player's turn.

## 5. User Interface (UI)
- [x] **Card Display:**
    - [x] Design and implement HTML/CSS for player cards (visuals, text, power level).
    - [x] Design and implement HTML/CSS for the player's hand area.
    - [x] Implement card interaction (click-to-play or drag-and-drop).
- [x] **Question Display:**
    - [x] Design and implement UI for displaying boss questions and options (modal/panel).
    - [x] Implement UI feedback for selections (highlighting).
    - [x] Implement UI feedback for correct/incorrect answers.
- [x] **Health Display:**
    - [x] Implement health bars/displays for Player and Boss.
    - [x] Ensure health displays update correctly after damage.
- [x] **General Layout:**
    - [x] Design the overall game screen layout (battlefield area, hand area, health displays, etc.).

## 6. 3D Animations (Three.js)
- [x] Set up Three.js scene.
- [x] Create or import 3D models for Boss and Player avatar.
- [x] Position models in the 3D scene (Battlefield).
- [x] Implement attack animation for Player -> Boss (on correct answer).
- [x] Implement attack animation for Boss -> Player (on incorrect answer).
- [x] Implement animation for card merging.

## 7. Sound Effects
- [x] Select or create sound assets.
- [x] Implement sound playback for correct answers.
- [x] Implement sound playback for incorrect answers.
- [x] Implement sound playback for card merging.
- [x] Add background music with mute toggle functionality.

## 8. Progression and Rewards
- [ ] Design progression system (unlocking stems, bosses, cards).
- [ ] Implement logic to handle post-victory rewards.
- [ ] Update player data/deck based on rewards.

## 9. Testing and Refinement
- [x] Test core game mechanics thoroughly.
- [x] Test UI interactions and responsiveness.
- [x] Test 3D animations and timing.
- [x] Implement card recycling mechanism to prevent running out of cards.
- [ ] Gather feedback and iterate on gameplay/UI/features.
- [ ] Debug and fix issues across all components. 