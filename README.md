# 🔐 EmojiPass

> Privacy-first password generator that runs entirely in your browser.

EmojiPass creates strong, customizable passwords locally on your device. Random values come from the browser's **Web Crypto API** (`crypto.getRandomValues()`), so generated passwords are not sent to a backend or external API.

## ✨ What's new in v2.0

- 🎨 Completely redesigned responsive interface
- 🔐 Cryptographically secure random generation with unbiased random selection
- 📏 Password length from **6 to 64** characters
- 🔠 Uppercase and lowercase letters
- 🔢 Numbers
- 🔣 Expanded symbol set
- 😎 Emoji mode with a larger emoji pool
- 🚫 Optional ambiguous-character exclusion (`I`, `l`, `1`, `O`, `0`)
- 🛡️ Guarantees at least one character from every selected category
- 📊 Improved strength indicator with estimated entropy
- 📋 Clipboard API with a browser fallback
- 🎲 Five quick-generated passwords
- ↻ One-click regeneration and quick-password refresh
- 🕒 Session-only password history with individual copy buttons
- 💾 Generator settings saved locally with `localStorage`
- 🔄 One-click settings reset
- ⌨️ `Ctrl + Enter` / `Cmd + Enter` shortcut for generation
- ♿ Keyboard focus states and reduced-motion support
- 📱 Mobile-first responsive layout
- 🌐 No external fonts or runtime dependencies

## 🛡️ Privacy & Security

EmojiPass is a **client-side application**.

- Password generation happens locally in your browser.
- Generated passwords are **not uploaded to a server**.
- There is no backend, database, analytics service, or password API.
- Session history is stored only in JavaScript memory and disappears after a page reload.
- Generator preferences are stored in browser `localStorage` when available.
- Random values are generated with the Web Crypto API, not `Math.random()`.
- The app does not require an account.

> **Important:** EmojiPass is an educational/open-source project and has not been professionally audited. Do not treat it as a substitute for a security-audited password manager.

### About the strength estimate

The entropy value is an **estimate based on the selected character pool and password length**. It is useful as a rough indicator, but it is not a security audit and does not account for every real-world attack scenario.

## 🧰 Features

### Password generation

Select any combination of:

- Uppercase letters
- Lowercase letters
- Numbers
- Symbols
- Emoji

EmojiPass always includes at least one character from each selected category, then fills the remaining positions and performs a cryptographically secure Fisher–Yates shuffle.

### Ambiguous characters

The optional **Exclude ambiguous** setting removes characters that are easy to confuse visually, such as `I`, `l`, `1`, `O`, and `0`.

### History

The current session can keep up to 10 generated passwords in memory. Each item can be copied individually, and the entire history can be cleared.

### Settings

The following generator preferences persist locally in the browser:

- Password length
- Character categories
- Emoji mode
- Ambiguous-character exclusion

No password history is persisted to `localStorage`.

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Web Crypto API
- Clipboard API
- LocalStorage API

No frameworks, packages, build tools, or backend are required.

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

### Option 1 — open directly

Open `index.html` in a modern browser.

### Option 2 — local HTTP server

For the most consistent browser API behavior, run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## 🌐 GitHub Pages

EmojiPass is a static site, so it can be deployed with GitHub Pages without a backend.

After enabling GitHub Pages for the repository, the site can be opened from the repository's Pages URL.

## 🧪 Browser requirements

EmojiPass expects a modern browser with support for:

- Web Crypto API
- Clipboard API or the legacy clipboard fallback
- LocalStorage
- Modern JavaScript
- CSS backdrop filters for the full visual effect (optional)

## 🔍 Security notes for development

The project intentionally avoids sending generated passwords anywhere. If you extend EmojiPass, keep this property intact:

1. Never log generated passwords.
2. Never send generated passwords to an API.
3. Never store password history in persistent storage by default.
4. Keep random generation based on `crypto.getRandomValues()`.
5. Do not replace the secure random generator with `Math.random()`.

## 📈 Project status

**Active development — v2.0**

EmojiPass is part of ORDBOY's software-development portfolio and is being improved as a practical frontend/security-oriented project.

## 👨‍💻 Author

**ORDBOY**

- GitHub: https://github.com/Ordboybro
- Repository: https://github.com/Ordboybro/EmojiPass

## 📄 License

EmojiPass is released under the **MIT License**. See `LICENSE` for details.

## ⭐ Support

If you find EmojiPass useful or interesting, consider giving the repository a ⭐.
