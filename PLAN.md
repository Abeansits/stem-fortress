# Stem Guardians: Development Plan

## 1. Project Setup & Core Data
- [ ] Set up project structure (HTML, CSS, JS folders).
- [ ] Create the initial `index.html` file.
- [ ] Create CSS file(s) for styling.
- [ ] Create JavaScript file(s) for game logic.
- [ ] Create the `stems.json` data file with initial stem data.
- [ ] Implement JSON data loading and parsing logic.

## 2. Game Components Implementation
- [ ] **Player Cards:**
    - [ ] Define the Player Card data structure (object/class).
    - [ ] Implement function to generate Player Cards from JSON data.
    - [ ] Assign `powerLevel` based on stem complexity (define criteria).
- [ ] **Boss Monster:**
    - [ ] Define the Boss Monster data structure (object/class).
    - [ ] Initialize Boss health.
    - [ ] Define the Boss Attack Card (question) structure.
    - [ ] Implement function to generate Boss Attack Cards (questions) from JSON data.
        - [ ] Ensure generation of correct and incorrect multiple-choice options.
- [ ] **Player:**
    - [ ] Initialize Player health.
    - [ ] Implement Player deck structure.
    - [ ] Implement Player hand structure.

## 3. Gameplay Flow Logic
- [ ] **Game Setup:**
    - [ ] Implement initial health setup for Player and Boss.
    - [ ] Implement Player deck creation from generated cards.
    - [ ] Implement Boss attack card deck creation.
    - [ ] Implement deck shuffling logic (Player and Boss).
    - [ ] Implement dealing initial Player hand (e.g., 5 cards).
- [ ] **Turn Sequence:**
    - [ ] Implement overall turn management logic.
    - [ ] **Boss's Turn:**
        - [ ] Implement drawing a Boss attack card (question).
        - [ ] Implement displaying the question and multiple-choice options.
    - [ ] **Player's Turn:**
        - [ ] Implement card selection from hand logic.
        - [ ] Implement answer selection logic.
        - [ ] Implement outcome logic (correct/incorrect answer).
            - [ ] Apply damage to Boss on correct answer (consider bonus damage).
            - [ ] Apply damage to Player on incorrect answer.
        - [ ] Implement card drawing logic for the player (if applicable, e.g., draw one card per turn).
    - [ ] **End of Turn:**
        - [ ] Implement win condition check (Boss health <= 0).
        - [ ] Implement lose condition check (Player health <= 0).
        - [ ] Implement transition to the next turn.
- [ ] **Winning and Losing:**
    - [ ] Implement game end screen/state for winning.
    - [ ] Implement game end screen/state for losing.
    - [ ] Implement restart option.

## 4. Merge Mechanic
- [ ] Implement logic to check for mergeable cards (same `stem`) in the player's hand.
- [ ] Implement card merging functionality.
    - [ ] Calculate new `powerLevel` for the "Super" card.
    - [ ] Define and implement optional special abilities for merged cards.
    - [ ] Update player's hand with the merged card.
- [ ] Integrate merge option into the start of the player's turn.

## 5. User Interface (UI)
- [ ] **Card Display:**
    - [ ] Design and implement HTML/CSS for player cards (visuals, text, power level).
    - [ ] Design and implement HTML/CSS for the player's hand area.
    - [ ] Implement card interaction (click-to-play or drag-and-drop).
- [ ] **Question Display:**
    - [ ] Design and implement UI for displaying boss questions and options (modal/panel).
    - [ ] Implement UI feedback for selections (highlighting).
    - [ ] Implement UI feedback for correct/incorrect answers.
- [ ] **Health Display:**
    - [ ] Implement health bars/displays for Player and Boss.
    - [ ] Ensure health displays update correctly after damage.
- [ ] **General Layout:**
    - [ ] Design the overall game screen layout (battlefield area, hand area, health displays, etc.).

## 6. 3D Animations (Three.js)
- [ ] Set up Three.js scene.
- [ ] Create or import 3D models for Boss and Player avatar.
- [ ] Position models in the 3D scene (Battlefield).
- [ ] Implement attack animation for Player -> Boss (on correct answer).
- [ ] Implement attack animation for Boss -> Player (on incorrect answer).
- [ ] Implement animation for card merging.

## 7. Sound Effects
- [ ] Select or create sound assets.
- [ ] Implement sound playback for correct answers.
- [ ] Implement sound playback for incorrect answers.
- [ ] Implement sound playback for card merging.

## 8. Progression and Rewards
- [ ] Design progression system (unlocking stems, bosses, cards).
- [ ] Implement logic to handle post-victory rewards.
- [ ] Update player data/deck based on rewards.

## 9. Testing and Refinement
- [ ] Test core game mechanics thoroughly.
- [ ] Test UI interactions and responsiveness.
- [ ] Test 3D animations and timing.
- [ ] Gather feedback and iterate on gameplay/UI/features.
- [ ] Debug and fix issues across all components. 