/* AUDIO: Звуковые эффекты интерфейса */
let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    return audioContext;
}

function playDiscoverSound() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.18);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.075, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.58);
}

function playExploreSound() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [880, 1320, 1760].forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.065 / (index + 1), now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
    });
}

function playLanguageSound() {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1450, now);
    osc.frequency.exponentialRampToValueAtTime(2100, now + 0.07);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
}

/* LANGUAGE: Открытие меню и сохранение выбранного языка */
const languageSelector = document.getElementById("languageSelector");
const languageButton = document.getElementById("languageButton");

languageButton.addEventListener("click", function(event) {
    event.stopPropagation();
    playLanguageSound();
    languageSelector.classList.toggle("open");
});

document.querySelectorAll(".language-option").forEach(function(option) {
    option.addEventListener("click", function() {
        const language = option.dataset.language;
        localStorage.setItem("votzetLanguage", language);
        languageButton.textContent = language + " ▾";
        languageSelector.classList.remove("open");
        playLanguageSound();
    });
});

document.addEventListener("click", function(event) {
    if (!languageSelector.contains(event.target)) {
        languageSelector.classList.remove("open");
    }
});

/* LANGUAGE: Восстановление последнего выбора */
const savedLanguage = localStorage.getItem("votzetLanguage");

if (savedLanguage) {
    languageButton.textContent = savedLanguage + " ▾";
}

/* NAVIGATION: Переход к отдельным разделам сайта */
document.getElementById("discoverButton").addEventListener("click", function() {
    playDiscoverSound();

    setTimeout(function() {
        window.location.href = "discover/";
    }, 180);
});

document.getElementById("exploreButton").addEventListener("click", function() {
    playExploreSound();

    setTimeout(function() {
        window.location.href = "explore/";
    }, 180);
});
