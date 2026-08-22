const $ = (selector) => document.querySelector(selector);

const passwordOutput = $("#passwordOutput");
const generateBtn = $("#generateBtn");
const regenerateBtn = $("#regenerateBtn");
const copyBtn = $("#copyBtn");
const clearHistoryBtn = $("#clearHistoryBtn");
const refreshQuickBtn = $("#refreshQuickBtn");
const resetSettingsBtn = $("#resetSettingsBtn");

const lengthSlider = $("#lengthSlider");
const lengthValue = $("#lengthValue");

const uppercase = $("#uppercase");
const lowercase = $("#lowercase");
const numbers = $("#numbers");
const symbols = $("#symbols");
const emojiMode = $("#emojiMode");
const excludeAmbiguous = $("#excludeAmbiguous");

const historyList = $("#historyList");
const emptyHistory = $("#emptyHistory");
const multiPasswords = $("#multiPasswords");
const settingsError = $("#settingsError");

const strengthText = $("#strengthText");
const entropyText = $("#entropyText");
const strengthFill = $("#strengthFill");
const strengthBar = $(".strength-bar");

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}<>?/|~:;,.";
const AMBIGUOUS = "Il1O0";
const EMOJIS = [
    "😎", "🔥", "🚀", "💎", "✨", "🎯", "⚡", "🎮",
    "🌟", "💻", "🧠", "🎉", "🔐", "❤️", "🍀", "🦊",
    "🐼", "🌈", "☀️", "🌙", "⭐", "🍕", "🎨", "🛡️"
];

const SETTINGS_KEY = "emojiPass.settings";
const MAX_HISTORY = 10;
const QUICK_PASSWORD_COUNT = 5;
const MIN_LENGTH = 6;
const MAX_LENGTH = 64;
const DEFAULT_SETTINGS = {
    length: 20,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    emojiMode: false,
    excludeAmbiguous: false
};

let history = [];
let toastTimer;

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
    saveSettings();
    clearSettingsError();
});

[uppercase, lowercase, numbers, symbols, emojiMode, excludeAmbiguous].forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        saveSettings();
        clearSettingsError();
        generateAll();
    });
});

generateBtn.addEventListener("click", generateAll);
regenerateBtn.addEventListener("click", generateMainPassword);
refreshQuickBtn.addEventListener("click", generateQuickPasswords);
copyBtn.addEventListener("click", copyPassword);
clearHistoryBtn.addEventListener("click", clearHistory);
resetSettingsBtn.addEventListener("click", resetSettings);

document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        generateAll();
    }
});

function getRandomIndex(max) {
    if (!Number.isSafeInteger(max) || max <= 0) {
        throw new Error("Invalid random range.");
    }

    if (!window.crypto?.getRandomValues) {
        throw new Error("Secure random generation is not supported by this browser.");
    }

    const maxUint32 = 0x100000000;
    const limit = Math.floor(maxUint32 / max) * max;
    const random = new Uint32Array(1);

    do {
        window.crypto.getRandomValues(random);
    } while (random[0] >= limit);

    return random[0] % max;
}

function getRandomItem(items) {
    return items[getRandomIndex(items.length)];
}

function shuffle(items) {
    for (let index = items.length - 1; index > 0; index--) {
        const randomIndex = getRandomIndex(index + 1);
        [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }

    return items;
}

function removeAmbiguousCharacters(characters) {
    return [...characters].filter((character) => !AMBIGUOUS.includes(character)).join("");
}

function getCharacterSet(characterSet, options = {}) {
    const { allowAmbiguous = true } = options;
    let characters = characterSet;

    if (!allowAmbiguous && characterSet !== EMOJIS) {
        characters = removeAmbiguousCharacters(characters);
    }

    return [...characters];
}

function getSelectedCharacterSets() {
    const sets = [];
    const allowAmbiguous = !excludeAmbiguous.checked;

    if (uppercase.checked) sets.push(getCharacterSet(UPPER, { allowAmbiguous }));
    if (lowercase.checked) sets.push(getCharacterSet(LOWER, { allowAmbiguous }));
    if (numbers.checked) sets.push(getCharacterSet(NUMBERS, { allowAmbiguous }));
    if (symbols.checked) sets.push(getCharacterSet(SYMBOLS, { allowAmbiguous }));
    if (emojiMode.checked) sets.push([...EMOJIS]);

    return sets.filter((set) => set.length > 0);
}

function getPasswordLength() {
    const length = Number(lengthSlider.value);

    if (!Number.isInteger(length) || length < MIN_LENGTH || length > MAX_LENGTH) {
        throw new Error(`Password length must be between ${MIN_LENGTH} and ${MAX_LENGTH}.`);
    }

    return length;
}

function createPassword() {
    const sets = getSelectedCharacterSets();

    if (sets.length === 0) {
        throw new Error("Select at least one character type.");
    }

    const length = getPasswordLength();

    if (length < sets.length) {
        throw new Error("Password length is too short for the selected options.");
    }

    const allCharacters = sets.flat();
    const passwordCharacters = sets.map((set) => getRandomItem(set));

    while (passwordCharacters.length < length) {
        passwordCharacters.push(getRandomItem(allCharacters));
    }

    return shuffle(passwordCharacters).join("");
}

function calculateEntropy(password) {
    if (!password) return 0;

    const sets = getSelectedCharacterSets();
    const poolSize = sets.reduce((total, set) => total + set.length, 0);

    if (poolSize <= 1) return 0;

    return Math.floor(password.length * Math.log2(poolSize));
}

function calculateStrength(password) {
    const entropy = calculateEntropy(password);

    if (!password) return { label: "—", width: 0, entropy: 0 };
    if (entropy < 40) return { label: "Weak", width: 25, entropy };
    if (entropy < 60) return { label: "Medium", width: 50, entropy };
    if (entropy < 80) return { label: "Strong", width: 75, entropy };

    return { label: "Very strong", width: 100, entropy };
}

function updateStrength(password) {
    const strength = calculateStrength(password);

    strengthText.textContent = `Strength: ${strength.label}`;
    entropyText.textContent = strength.entropy
        ? `Estimated entropy: ~${strength.entropy} bits`
        : "Estimated entropy: —";

    strengthFill.style.width = `${strength.width}%`;
    strengthBar?.setAttribute("aria-valuenow", String(strength.width));
}

function generateMainPassword() {
    try {
        const password = createPassword();
        passwordOutput.value = password;
        updateStrength(password);
        addToHistory(password);
        clearSettingsError();
    } catch (error) {
        passwordOutput.value = "";
        updateStrength("");
        showSettingsError(error.message);
    }
}

function generateAll() {
    generateMainPassword();

    if (passwordOutput.value) {
        generateQuickPasswords();
    } else {
        multiPasswords.replaceChildren();
    }
}

function addToHistory(password) {
    history = [password, ...history.filter((item) => item !== password)].slice(0, MAX_HISTORY);
    renderHistory();
}

function clearHistory() {
    history = [];
    renderHistory();
    showToast("Session history cleared.");
}

function renderHistory() {
    historyList.replaceChildren();
    emptyHistory.hidden = history.length > 0;

    history.forEach((password, index) => {
        const item = document.createElement("li");
        const passwordText = document.createElement("code");
        const copyButton = document.createElement("button");

        passwordText.textContent = password;
        copyButton.type = "button";
        copyButton.className = "history-copy";
        copyButton.textContent = "Copy";
        copyButton.setAttribute("aria-label", `Copy session password ${index + 1}`);
        copyButton.addEventListener("click", () => copyToClipboard(password));

        item.append(passwordText, copyButton);
        historyList.appendChild(item);
    });
}

function saveSettings() {
    const settings = {
        length: Number(lengthSlider.value),
        uppercase: uppercase.checked,
        lowercase: lowercase.checked,
        numbers: numbers.checked,
        symbols: symbols.checked,
        emojiMode: emojiMode.checked,
        excludeAmbiguous: excludeAmbiguous.checked
    };

    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
        showToast("Settings could not be saved in this browser.");
    }
}

function loadSettings() {
    let settings = {};

    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        const parsed = stored ? JSON.parse(stored) : null;
        settings = parsed && typeof parsed === "object" ? parsed : {};
    } catch {
        try {
            localStorage.removeItem(SETTINGS_KEY);
        } catch {
            // Ignore unavailable browser storage.
        }
    }

    const merged = { ...DEFAULT_SETTINGS, ...settings };
    const safeLength = Number.isInteger(merged.length)
        ? Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, merged.length))
        : DEFAULT_SETTINGS.length;

    lengthSlider.value = safeLength;
    lengthValue.textContent = safeLength;

    for (const [key, element] of [
        ["uppercase", uppercase],
        ["lowercase", lowercase],
        ["numbers", numbers],
        ["symbols", symbols],
        ["emojiMode", emojiMode],
        ["excludeAmbiguous", excludeAmbiguous]
    ]) {
        if (typeof merged[key] === "boolean") {
            element.checked = merged[key];
        }
    }
}

function resetSettings() {
    lengthSlider.value = DEFAULT_SETTINGS.length;
    lengthValue.textContent = DEFAULT_SETTINGS.length;

    uppercase.checked = DEFAULT_SETTINGS.uppercase;
    lowercase.checked = DEFAULT_SETTINGS.lowercase;
    numbers.checked = DEFAULT_SETTINGS.numbers;
    symbols.checked = DEFAULT_SETTINGS.symbols;
    emojiMode.checked = DEFAULT_SETTINGS.emojiMode;
    excludeAmbiguous.checked = DEFAULT_SETTINGS.excludeAmbiguous;

    saveSettings();
    generateAll();
    showToast("Settings reset to defaults.");
}

function generateQuickPasswords() {
    multiPasswords.replaceChildren();

    try {
        for (let index = 0; index < QUICK_PASSWORD_COUNT; index++) {
            const password = createPassword();
            const item = document.createElement("button");

            item.type = "button";
            item.className = "generated-password";
            item.textContent = password;
            item.setAttribute("aria-label", `Copy quick password ${index + 1}`);
            item.title = "Click to copy";
            item.addEventListener("click", () => copyToClipboard(password));

            multiPasswords.appendChild(item);
        }

        clearSettingsError();
    } catch (error) {
        showSettingsError(error.message);
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
    if (!value) return;

    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(value);
        } else {
            copyWithFallback(value);
        }

        showToast("Password copied 📋");
    } catch {
        showToast("Copy failed. Try selecting the password manually.");
    }
}

function copyWithFallback(value) {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) {
        throw new Error("Fallback copy failed.");
    }
}

function showSettingsError(message) {
    settingsError.textContent = message;
    settingsError.hidden = false;
}

function clearSettingsError() {
    settingsError.textContent = "";
    settingsError.hidden = true;
}

function showToast(message) {
    document.querySelector(".toast")?.remove();
    clearTimeout(toastTimer);

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 250);
    }, 2200);
}

loadSettings();
renderHistory();
generateAll();
