# Web Development Project 3 - *Starbucks Barista Training App*

Submitted by: **Chau Cao**

This web app: **A dual-mode training application designed to help users memorize Starbucks drink recipes. It features a "Study Mode" with interactive, fuzzy-matching flashcards and a "Play Mode" featuring a Wordle-style ingredient guessing game.**

Time spent: **77.53** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **The user can enter their guess into an input box *before* seeing the flipside of the card**
  - Application features a clearly labeled input box with a submit button where users can type in a guess
  - Clicking on the submit button with an **incorrect** answer shows visual feedback that it is wrong 
  -  Clicking on the submit button with a **correct** answer shows visual feedback that it is correct
- [x] **The user can navigate through an ordered list of cards**
  - A forward/next button displayed on the card navigates to the next card in a set sequence when clicked
  - A previous/back button displayed on the card returns to the previous card in the set sequence when clicked
  - Both the next and back buttons should have some visual indication that the user is at the beginning or end of the list (for example, graying out and no longer being available to click), not allowing for wrap-around navigation

The following **optional** features are implemented:


- [ ] Users can use a shuffle button to randomize the order of the cards
  - Cards should remain in the same sequence (**NOT** randomized) unless the shuffle button is clicked 
  - Cards should change to a random sequence once the shuffle button is clicked
- [x] A user’s answer may be counted as correct even when it is slightly different from the target answer
  - Answers are considered correct even if they only partially match the answer on the card 
  - Examples: ignoring uppercase/lowercase discrepancies, ignoring punctuation discrepancies, matching only for a particular part of the answer rather than the whole answer
- [x] A counter displays the user’s current and longest streak of correct responses
  - The current counter increments when a user guesses an answer correctly
  - The current counter resets to 0 when a user guesses an answer incorrectly
  - A separate counter tracks the longest streak, updating if the value of the current streak counter exceeds the value of the longest streak counter 
- [x] A user can mark a card that they have mastered and have it removed from the pool of displayed cards
  - The user can mark a card to indicate that it has been mastered
  - Mastered cards are removed from the pool of displayed cards and added to a list of mastered cards


The following **additional** features are implemented:

* [x] Two distinct App Modes: A smooth sliding UI toggle switches between Study Mode (Flashcards) and Play Mode (Wordle Game).
* [x] Users get 6 attempts to correctly guess the 6 ingredient categories of a random drink, with real-time color-coded feedback in Play Mode (Wordle Game).
* [x] Users can download a generated "Receipt" image of their Play Mode results to share with friends using `html12canvas` for image generation.
* [x] XP is awarded for studying and playing, allowing users to rank up from "Green Bean" to "Coffee Master," saved via localStorage.
* [x] Custom CSS variables allow seamless toggling between a bright, Starbucks-themed light mode and a sleek dark mode.
* [x] Hint System: A lifeline in Play Mode that dynamically reveals one missing ingredient if the user gets stuck.
* [x] Users can use Spacebar to flip cards and Arrow Keys to navigate the study deck efficiently.
* [x] Mobile Responsiveness: The UI dynamically resizes guess boxes and grids to remain playable on mobile devices.

## Video Walkthrough

Here's a walkthrough of implemented user stories:
* Study Mode (Flashcard)
![Image](https://github.com/user-attachments/assets/72a4ba63-43c8-4ebe-a074-a82b9ae8de0f)
<img src='https://i.imgur.com/DI4kKVw.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />
* Play Mode (Wordle)
![Image](https://github.com/user-attachments/assets/abbe931c-1c18-4cee-8c93-96fc1598edf8)

GIF created with ...  
[ScreenToGif](https://www.screentogif.com/) for Windows

## Notes

* Handling the Play Mode logic required careful tracking of the currentGuess object and comparing it against the targetDrink object. A major hurdle was accidentally using the assignment operator (=) instead of the strict equality operator (===), which caused all answers to evaluate as true.
* Managing absolute and relative positioning to prevent UI elements (like the Mastered Badge and the Dark Mode toggle) from overlapping on different screen sizes.
* Encountered issues trying to dynamically render images from the src/assets folder via JSON strings. Learned that Vite requires dynamically referenced static assets to be housed in the public directory to prevent bundling errors.
* Implementing html2canvas to generate the shareable receipt required careful DOM targeting using useRef and debugging case-sensitive variable names (imageURL vs imageUrl) to ensure the drink images rendered properly on the downloaded PNG.

## License

    Copyright [2026] [Chau Cao]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
