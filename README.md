# 🔐 EmojiPass

> A browser-based password generator focused on secure randomness, customizable generation, and a clean modern interface.

EmojiPass generates passwords locally in the browser. It uses the Web Crypto API for random values and does not send generated passwords to a server.

## ✨ Features

- 🔐 Cryptographically stronger random generation with `crypto.getRandomValues()`
- 📏 Password length from 6 to 64 characters
- 🔠 Uppercase and lowercase letters
- 🔢 Numbers
- 🔣 Symbols
- 😎 Optional emoji mode
- 🛡️ Guarantees at least one character from every selected character set
- 💪 Password strength indicator
- 📋 One-click clipboard copying
- 🎲 Five quick-generated passwords
- 🕒 Session-only password history
- 💾 Generator settings saved locally in the browser
- 📱 Responsive interface
- ♿ Keyboard and reduced-motion accessibility improvements

## 🛡️ Privacy & Security

EmojiPass is a client-side application.

- Password generation happens in your browser.
- Generated passwords are **not sent to a backend or external API**.
- Password history exists only for the current browser session.
- Generator preferences may be stored in `localStorage`.
- The project uses the browser Web Crypto API instead of `Math.random()` for password generation.

> **Important:** EmojiPass is an educational/open-source project, not a replacement for a professionally audited password manager. Avoid storing highly sensitive passwords in browser history or other insecure locations.

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Web Crypto API
- LocalStorage API
- Clipboard API

## 📂 Project Structure

```text
EmojiPass/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

## 🚀 Run locally

Clone the repository:

```bash
git clone https://github.com/Ordboybro/EmojiPass.git
cd EmojiPass
```

Then open `index.html` in a modern browser.

For the best browser security/API compatibility, you can also serve the project locally with a simple HTTP server:

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## 🧪 Browser support

EmojiPass requires a modern browser with support for:

- Web Crypto API
- Clipboard API
- LocalStorage
- modern JavaScript

## 📸 Demo

The project can be used directly through its GitHub Pages deployment when enabled.

## 📈 Project Status

**Active development** — the project is being improved as part of my backend and software-development learning journey.

## 👨‍💻 Author

**ORDBOY**

- GitHub: https://github.com/Ordboybro

## ⭐ Support

If you find EmojiPass useful or interesting, consider giving the repository a ⭐.