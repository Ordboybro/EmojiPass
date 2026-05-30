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
    "😎","🔥","🚀","💎","✨",
    "🎯","⚡","🎮","🌟","💻",
    "🧠","🎉","🔐","❤️","🍀"
];

let history = [];

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

generateBtn.addEventListener("click", () => {
    generateMainPassword();
    generateQuickPasswords();
});

copyBtn.addEventListener("click", copyPassword);

function generateMainPassword() {

    const password = createPassword();

    passwordOutput.value = password;

    updateStrength(password);

    saveHistory(password);
}

function createPassword() {

    let chars = "";

    if (uppercase.checked) chars += UPPER;
    if (lowercase.checked) chars += LOWER;
    if (numbers.checked) chars += NUMBERS;
    if (symbols.checked) chars += SYMBOLS;

    if (chars.length === 0) {
        return "Select options";
    }

    const length = Number(lengthSlider.value);

    let password = "";

    for (let i = 0; i < length; i++) {

        const randomIndex =
            Math.floor(Math.random() * chars.length);

        password += chars[randomIndex];
    }

    if (emojiMode.checked) {

        const emojiCount = Math.max(
            1,
            Math.floor(length / 8)
        );

        for (let i = 0; i < emojiCount; i++) {

            const emoji =
                EMOJIS[
                    Math.floor(
                        Math.random() * EMOJIS.length
                    )
                ];

            const position =
                Math.floor(
                    Math.random() * password.length
                );

            password =
                password.slice(0, position) +
                emoji +
                password.slice(position);
        }
    }

    return password;
}

function updateStrength(password) {

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 18) score++;

    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let text = "Weak";
    let width = 25;

    if (score >= 3) {
        text = "Medium";
        width = 50;
    }

    if (score >= 5) {
        text = "Strong";
        width = 75;
    }

    if (score >= 7) {
        text = "Ultra Secure";
        width = 100;
    }

    strengthText.textContent =
        `Strength: ${text}`;

    strengthFill.style.width =
        `${width}%`;
}

function saveHistory(password) {

    history.unshift(password);

    if (history.length > 10) {
        history.pop();
    }

    renderHistory();
}

function renderHistory() {

    historyList.innerHTML = "";

    history.forEach(pass => {

        const li =
            document.createElement("li");

        li.textContent = pass;

        historyList.appendChild(li);
    });
}

function generateQuickPasswords() {

    multiPasswords.innerHTML = "";

    for (let i = 0; i < 5; i++) {

        const pass = createPassword();

        const item =
            document.createElement("div");

        item.className =
            "generated-password";

        item.textContent = pass;

        item.addEventListener("click", () => {

            navigator.clipboard.writeText(pass);

            showToast(
                "Password copied 📋"
            );
        });

        multiPasswords.appendChild(item);
    }
}

async function copyPassword() {

    const value =
        passwordOutput.value;

    if (!value) return;

    try {

        await navigator.clipboard.writeText(value);

        showToast(
            "Copied to clipboard 📋"
        );

    } catch {

        showToast(
            "Copy failed ❌"
        );
    }
}

function showToast(message) {

    const oldToast =
        document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast =
        document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2200);
}

generateMainPassword();
generateQuickPasswords();