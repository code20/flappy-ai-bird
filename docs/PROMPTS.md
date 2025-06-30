
# 💬 PROMPTS.md  
> A log of the natural language prompts used to build Flappy Ai Bird with GitHub Copilot

This project was created using only prompt-based guidance—no manually typed code. Every feature, fix, and flourish was generated through conversational instructions in Visual Studio Code with GitHub Copilot.

Below is a record of the kinds of prompts used to steer development. Some were direct, others exploratory or iterative.

---

## 🏗️ Game Setup & Canvas

- “Set up an HTML5 canvas that fills the browser window and is mobile-friendly.”
- “Create a JavaScript module that initializes the canvas and starts the game loop.”
- “Make the canvas resize dynamically with the window.”

---

## 🎮 Core Gameplay Mechanics

- “Add a bird character that falls unless it flaps upward.”
- “Make the bird flap when the spacebar is pressed or when the player clicks/taps.”
- “Implement gravity and velocity for the bird’s movement.”
- “Create pipes that spawn at random heights and move from right to left.”
- “Detect collisions between the bird and pipes.”
- “Track the player's score and increase it when a pipe is passed.”

---

## 🤖 AI-Inspired Obstacles

- “Add a new obstacle type called ‘statue’ that behaves differently from pipes.”
- “Make statues appear lower and shake slightly when the bird is near.”
- “Ensure statues don’t appear as often as pipes.”

---

## 🎨 Visuals & Effects

- “Create a parallax-scrolling background with animated clouds.”
- “Add a particle effect when the bird flaps or collides.”
- “Display hearts for player lives in the top-left corner.”
- “Create a game over screen with a restart button.”
- “Make the start screen with a title and a ‘play’ button.”

---

## 🔊 Audio Prompts

- “Add jump, hit, and score sound effects and play them at the right time.”
- “Use royalty-free or custom-made audio files like `jump.mp3` and `score.mp3`.”
- “Mute audio when the game is paused.”

---

## ⏸️ Game States & Controls

- “Implement a pause and resume feature using the P key and an on-screen button.”
- “Track the best score using localStorage and display it after a game over.”
- “Reset game state cleanly on restart.”

---

## 🐞 Fixes & Tweaks

- “Fix bug where the game over screen doesn’t appear after losing all lives.”
- “Prevent the bird from clipping through pipes on collision.”
- “Balance obstacle speed and spacing to improve gameplay difficulty.”

---

> Copilot wasn't always right on the first try—but with creative rewording and iterative nudges, it was possible to shape the entire game using natural prompts like these.
