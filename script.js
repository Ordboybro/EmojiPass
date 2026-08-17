const passwordOutput = document.getElementById("passwordOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");
const emojiMode = document.getElementById("emojiMode");

const historyList = document.getElementById("historyList");
const multiPasswords = document.getElementById("multiPasswords");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}<>?/|";
const EMOJIS = [
    "😎", "🔥", "🚀", "💎", "✨",
    "🎯", "⚡", "🎮", "🌟", "💻",
    "🧠", "🎉", "🔐", "❤️", "🍀"
];

const HISTORY_KEY = "emojiPass.history";
const SETTINGS_KEY = "emojiPass.settings";
const MAX_HISTORY = 10;

let history = loadHistory();

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
    saveSettings();
});

[uppercase, lowercase, numbers, symbols, emojiMode].forEach((checkbox) => {
    checkbox.addEventListener("change", saveSettings);
});

generateBtn.addEventListener("click", () => {
    generateMainPassword();
    generateQuickPasswords();
});

copyBtn.addEventListener("click", copyPassword);

function getRandomIndex(max) {
    if (max <= 0) {
        throw new Error("Random range must be greater than zero.");
    }

    const maxUint32 = 0x100000000;
    const limit = Math.floor(maxUint32 / max) * max;
    const random = new Uint32Array(1);

    do {
        crypto.getRandomValues(random);
    } while (random[0] >= limit);

    return random[0] % max;
}

function getRandomCharacter(characters) {
    return characters[getRandomIndex(characters.length)];
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = getRandomIndex(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function getSelectedCharacterSets() {
    const sets = [];

    if (uppercase.checked) sets.push(UPPER);
    if (lowercase.checked) sets.push(LOWER);
    if (numbers.checked) sets.push(NUMBERS);
    if (symbols.checked) sets.push(SYMBOLS);
    if (emojiMode.checked) sets.push(EMOJIS);

    return sets;
}

function createPassword() {
    const sets = getSelectedCharacterSets();

    if (sets.length === 0) {
        throw new Error("Select at least one character type.");
    }

    const length = Number(lengthSlider.value);

    if (!Number.isInteger(length) || length < 6 || length > 64) {
        throw new Error("Password length must be between 6 and 64.");
    }

    if (length < sets.length) {
        throw new Error("Password length is too short for the selected options.");
    }

    const passwordCharacters = [];

    // Guarantee at least one character from every selected character set.
    for (const set of sets) {
        passwordCharacters.push(
            Array.isArray(set)
                ? set[getRandomIndex(set.length)]
                : getRandomCharacter(set)
        );
    }

    const allCharacters = sets.flatMap((set) =>
        Array.isArray(set) ? set : [...set]
    );

    while (passwordCharacters.length < length) {
        passwordCharacters.push(getRandomCharacter(allCharacters));
    }

    return shuffle(passwordCharacters).join("");
}

function generateMainPassword() {
    try {
        const password = createPassword();

        passwordOutput.value = password;
        updateStrength(password);
        saveHistory(password);
    } catch (error) {
        passwordOutput.value = "";
        updateStrength("");
        showToast(error.message);
    }
}

function calculateStrength(password) {
    if (!password) return 0;

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 20) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
}

function updateStrength(password) {
    const score = calculateStrength(password);

    const levels = [
        { text: "—", width: 0 },
        { text: "Weak", width: 25 },
        { text: "Weak", width: 25 },
        { text: "Medium", width: 50 },
        { text: "Medium", width: 50 },
        { text: "Strong", width: 75 },
        { text: "Strong", width: 75 },
        { text: "Very Strong", width: 100 }
    ];

    const level = levels[Math.min(score, levels.length - 1)];

    strengthText.textContent = `Strength: ${level.text}`;
    strengthFill.style.width = `${level.width}%`;
}

function saveHistory(password) {
    history = [password, ...history.filter((item) => item !== password)]
        .slice(0, MAX_HISTORY);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
}

function loadHistory() {
    try {
        const stored = JSON.parse(localStorage.getItem(HISTORY_KEY));
        return Array.isArray(stored) ? stored.slice(0, MAX_HISTORY) : [];
    } catch {
        return [];
    }
}

function renderHistory() {
    historyList.replaceChildren();

    history.forEach((password) => {
        const li = document.createElement("li");
        li.textContent = password;
        historyList.appendChild(li);
    });
}

function saveSettings() {
    const settings = {
        length: Number(lengthSlider.value),
        uppercase: uppercase.checked,
        lowercase: lowercase.checked,
        numbers: numbers.checked,
        symbols: symbols.checked,
        emojiMode: emojiMode.checked
    };

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function loadSettings() {
    try {
        const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY));

        if (!settings || typeof settings !== "object") return;

        if (Number.isInteger(settings.length)) {
            const safeLength = Math.min(64, Math.max(6, settings.length));
            lengthSlider.value = safeLength;
            lengthValue.textContent = safeLength;
        }

        if (typeof settings.uppercase === "boolean") {
            uppercase.checked = settings.uppercase;
        }

        if (typeof settings.lowercase === "boolean") {
            lowercase.checked = settings.lowercase;
        }

        if (typeof settings.numbers === "boolean") {
            numbers.checked = settings.numbers;
        }

        if (typeof settings.symbols === "boolean") {
            symbols.checked = settings.symbols;
        }

        if (typeof settings.emojiMode === "boolean") {
            emojiMode.checked = settings.emojiMode;
        }
    } catch {
        localStorage.removeItem(SETTINGS_KEY);
    }
}

function generateQuickPasswords() {
    multiPasswords.replaceChildren();

    for (let i = 0; i < 5; i++) {
        try {
            const password = createPassword();
            const item = document.createElement("button");

            item.type = "button";
            item.className = "generated-password";
            item.textContent = password;

            item.addEventListener("click", async () => {
                await copyToClipboard(password);
            });

            multiPasswords.appendChild(item);
        } catch (error) {
            showToast(error.message);
            break;
        }
    }
}

async function copyPassword() {
    const value = passwordOutput.value;

    if (!value) {
        showToast("Generate a password first.");
        return;
    }

    await copyToClipboard(value);
}

async function copyToClipboard(value) {
    try {
        await navigator.clipboard.writeText(value);
        showToast("Password copied 📋");
    } catch {
        showToast("Copy failed ❌");
    }
}

function showToast(message) {
    document.querySelector(".toast")?.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

loadSettings();
renderHistory();
generateMainPassword();
generateQuickPasswords();