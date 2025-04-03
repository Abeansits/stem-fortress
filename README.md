# Stem Guardians: A Card Battle

## Overview
"Stem Guardians: A Card Battle" is an educational card game built using web technologies and Three.js for 3D animations. Players assume the role of "Stem Guardians," defending the Word Realm from boss monsters by answering questions about word stems. The game combines card collection, turn-based strategy, and a merge mechanic to upgrade cards, making it both engaging and educational.

---

## Data Structure
The game relies on a JSON file to store word stems, their meanings, example words, and the meanings of those examples. Here's an example:

```json
[
  {
    "stem": "pop",
    "meaning": "people",
    "example": "populate",
    "exampleMeaning": "make more people"
  },
  {
    "stem": "sangui",
    "meaning": "blood",
    "example": "sanguine",
    "exampleMeaning": "lots of blood"
  }
]
```

- **Fields**:
  - `stem`: The root word part (e.g., "pop").
  - `meaning`: The stem's definition (e.g., "people").
  - `example`: A word using the stem (e.g., "populate").
  - `exampleMeaning`: The meaning of the example word (e.g., "make more people").

---

## Game Components

### 1. Player Cards
- **Properties**:
  - `stem`: The word stem.
  - `meaning`: The stem's meaning.
  - `example`: An example word.
  - `exampleMeaning`: The example's meaning.
  - `powerLevel`: A numerical strength value (1-5, assigned based on stem complexity).
- **Visuals**: Cards feature anime-style characters tied to the stem's meaning (e.g., a "Pop Guardian" with a crowd-like design).

### 2. Boss Monster
- **Attributes**:
  - `health`: Starts at 20 points, decreases with correct answers.
  - `attackCards`: A deck of question cards about stems.

### 3. Player Health
- Starts at 20 points, reduced by 2 points per incorrect answer.

### 4. Merge Mechanic
- Players can combine two cards with the same `stem` to create a "Super" card with:
  - Increased `powerLevel` (e.g., `max(powerLevel1, powerLevel2) + 2`).
  - Optional special abilities (e.g., "Heal 2 health when played").

---

## Gameplay Flow

### Setup
1. **Load Data**:
   - Parse the JSON file to populate the player's deck and boss's attack cards.
2. **Initialize Health**:
   - Boss: 20 health.
   - Player: 20 health.
3. **Shuffle Decks**:
   - Player's deck: Randomize the order of stem cards (e.g., 5 cards initially).
   - Boss's deck: Randomize attack cards generated from the JSON data.

### Turn Sequence
1. **Boss's Turn**:
   - Draw an attack card with a question, such as:
     - "What does '[stem]' mean?"
     - "Which word uses '[stem]'?"
     - "What does '[example]' mean?"
   - Display the question with 3-4 multiple-choice options.

2. **Player's Turn**:
   - **Card Selection**: Choose a card from the hand (ideally matching the question's stem).
   - **Answer**: Select a multiple-choice option.
   - **Outcome**:
     - **Correct**: The card attacks, reducing boss health by its `powerLevel`. If the card's stem matches the question, add a bonus (e.g., +1 damage).
     - **Incorrect**: Boss counterattacks, reducing player health by 2.

3. **Merge Option**:
   - At the start of the turn, if two cards share the same `stem`, merge them into a "Super" card.

4. **End of Turn**:
   - **Win**: Boss health ≤ 0.
   - **Lose**: Player health ≤ 0.
   - Otherwise, proceed to the next turn.

### Winning and Losing
- **Win**: Defeat the boss to unlock new stems, bosses, or cards.
- **Lose**: Game ends; offer a restart option.

---

## Implementation Details

### 1. Card Generation
- **Player Cards**:
  - For each JSON entry, create an object with `stem`, `meaning`, `example`, `exampleMeaning`, and `powerLevel`.
  - Example: `{ stem: "pop", meaning: "people", example: "populate", exampleMeaning: "make more people", powerLevel: 3 }`.
- **Boss Attack Cards**:
  - Generate questions from the player's deck.
  - Include one correct answer and 2-3 incorrect options (e.g., meanings/examples from other stems).

### 2. User Interface
- **Card Display**:
  - Use HTML/CSS for card layouts (image, text, `powerLevel`).
  - Enable drag-and-drop or click-to-play interactions.
- **Question Display**:
  - Show the question and options in a modal or panel.
  - Highlight selections and display feedback ("Correct!" or "Incorrect!").
- **Health Bars**:
  - Use progress bars or numerical displays, updated after each turn.

### 3. 3D Animations with Three.js
- **Battlefield**:
  - Create a 3D scene with a boss model and player avatar.
  - Animate attacks:
    - Correct answer: Player character strikes the boss.
    - Incorrect answer: Boss strikes the player.
- **Card Merging**:
  - Animate two cards merging into a glowing "Super" card.

### 4. Merge Mechanic
- **Logic**:
  - Check for duplicate `stem` values in the hand.
  - Replace with a new card: `powerLevel = max(powerLevel1, powerLevel2) + 2`.
  - Optional: Add a `specialAbility` property (e.g., `{ heal: 2 }`).

### 5. Sound Effects
- **Correct Answer**: Triumphant sound (e.g., fanfare).
- **Incorrect Answer**: Warning sound (e.g., buzz).
- **Merging**: Magical chime.

### 6. Progression and Rewards
- Post-victory:
  - Unlock new stems or bosses.
  - Add new cards to the deck or upgrade existing ones (e.g., +1 `powerLevel`).

---

## Technical Requirements
- **Frontend**: HTML, CSS, JavaScript.
- **3D Graphics**: Three.js for animations.
- **Data**: JSON file for stems.
- **Interactivity**: Event listeners for card play, answer selection, and merging.

---

## Style, Look, and Feel

### 1. Visual Theme & Style Guide
*   **Overall Aesthetic**: Dark Fantasy with a slightly retro touch (think classic RPGs, but cleaner than pixel art). The mood is exciting and slightly mysterious, but still approachable for kids.
*   **Color Palette**: Dominated by dark grays (`#333333`, `#1E1E1E`) and accented with vibrant oranges (`#FFA500`, `#FF8C00`) for player elements, UI highlights, and positive feedback. Boss elements might use dark reds (`#8B0000`) or deep purples (`#4B0082`).
*   **Typography**:
    *   Headings/Card Names: "Cinzel" (a thematic serif font).
    *   UI Text/Descriptions: "Poppins" (a clean, readable sans-serif font).
*   **UI Elements**:
    *   **Buttons**: Chunky, dark gray with slight texture, orange borders/text. Glow orange on hover/selection.
    *   **Health Bars**: Simple rectangular bars with a dark background. Player health is orange, Boss health is dark red.
    *   **Modals/Pop-ups**: Dark semi-transparent overlay, defined orange borders, clear text layout.
    *   **Background**: A static 2D image.
*   **Iconography**: Simple, bold icons using orange outlines or fills on dark shapes for clarity (e.g., sword icon for attack, heart for health, swirling icon for merge).

### 2. Character & Asset Design
*   **Player Avatar**: A young apprentice character (mage or scholar look) in simple robes, perhaps holding a glowing book, viewed from the side or back in the 3D scene.
*   **Boss Monster Example**: A "Shadow Beast" - a creature made of swirling dark purple/grey smoke or energy, with piercing orange eyes. Its form is somewhat indistinct but menacing.
*   **Card Guardian Examples**: Anime-inspired but fitting the darker theme.
    *   *Pop Guardian*: A small, hooded figure seemingly composed of multiple faint silhouettes, carrying an orange banner.
    *   *Sangui Guardian*: A character in dark armor with glowing crimson highlights, maybe wielding an energy shield.
*   **Battlefield Background**: A 2D illustration depicting ancient, slightly spooky library ruins at night. Stone textures, dimly lit by orange magical glows from runes or floating candles. Focus is on atmosphere rather than complex detail.

### 3. User Experience (UX) & Feel
*   **Mood**: Exciting and engaging, with a touch of dark fantasy mystery.
*   **Interactions**: Clear and responsive.
    *   *Hover*: Cards lift/scale slightly and glow orange; buttons glow brighter.
    *   *Feedback*: Obvious visual cues – orange flash/particle effect for correct, red flash for incorrect. Damage numbers pop up clearly.
    *   *Transitions*: Quick fades or slides for UI elements. Card play involves a simple, fast animation towards the target. Merge animation is a brief, bright glow and scaling effect.

### 4. Sound Design
*   **Background Music**: An looping orchestral piece with an epic fantasy feel, possibly with subtle retro synth elements. Should be engaging but not overly intrusive.
*   **Sound Effects**: Distinct and clear.
    *   *Correct Answer*: Bright, positive chime or sparkle sound.
    *   *Incorrect Answer*: Low buzz, error sound, or dull thud.
    *   *Card Attack*: Swoosh and impact sound.
    *   *Merge*: Magical shimmer or an ascending whoosh sound.

### 5. Responsiveness
*   **Target Platform**: Desktop browsers only. Layout will be fixed and optimized for typical desktop screen resolutions.

---

## Example Gameplay Walkthrough
Here's how the game plays out step-by-step:

1. **Setup**:
   - Load JSON data.
   - Player's hand: 5 cards (e.g., Pop Guardian [power 3], Sangui Guardian [power 2], etc.).
   - Boss health: 20. Player health: 20.

2. **Turn 1**:
   - **Boss**: Draws "What does 'pop' mean?"
     - Options: A) People, B) Sound, C) Food.
   - **Player**: Plays Pop Guardian, selects A) People.
   - **Result**: Correct! Boss health -= 3 (now 17).

3. **Turn 2**:
   - **Boss**: Draws "Which word uses 'sangui'?"
     - Options: A) Sanguine, B) Sangria, C) Sanguinary.
   - **Player**: Plays Sangui Guardian, selects B) Sangria.
   - **Result**: Incorrect! Player health -= 2 (now 18).

4. **Turn 3**:
   - **Merge**: Player has two "pop" cards (power 3 and 2), merges into Super Pop Guardian (power 5).
   - **Boss**: Draws "What does 'populate' mean?"
     - Options: A) Make more people, B) Travel far, C) Build houses.
   - **Player**: Plays Super Pop Guardian, selects A) Make more people.
   - **Result**: Correct! Boss health -= 5 (now 12).

5. **Continue**:
   - Turns repeat until boss health = 0 (win) or player health = 0 (loss).

---

## Conclusion
This README provides a complete blueprint for "Stem Guardians: A Card Battle." It details the game's mechanics, data structure, UI, animations, and progression, enabling an engineer to build an interactive, educational card game that teaches word stems through strategic gameplay.
