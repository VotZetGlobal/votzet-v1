// MAIN SYSTEM: Навигация и звуки VotZet

document.addEventListener("DOMContentLoaded", () => {

    // AUDIO SYSTEM: Металлический crystalline звук
    let audioContext = null;

    function playButtonSound(type) {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (audioContext.state === "suspended") {
                audioContext.resume();
            }

            const now = audioContext.currentTime;

            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "sine";

            if (type === "discover") {
                oscillator.frequency.setValueAtTime(880, now);
                oscillator.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
            } else if (type === "explore") {
                oscillator.frequency.setValueAtTime(660, now);
                oscillator.frequency.exponentialRampToValueAtTime(990, now + 0.18);
            } else if (type === "home") {
                oscillator.frequency.setValueAtTime(740, now);
                oscillator.frequency.exponentialRampToValueAtTime(1100, now + 0.15);
            } else if (type === "language") {
                oscillator.frequency.setValueAtTime(1000, now);
                oscillator.frequency.exponentialRampToValueAtTime(1500, now + 0.12);
            }

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start(now);
            oscillator.stop(now + 0.25);

        } catch (error) {
            console.warn("VotZet audio unavailable:", error);
        }
    }

    // HOME NAVIGATION: Переход на Discover
    const discoverButton = document.getElementById("discoverButton");

    if (discoverButton) {
        discoverButton.addEventListener("click", () => {
            playButtonSound("discover");

            setTimeout(() => {
                window.location.href = "discover/";
            }, 120);
        });
    }

    // HOME NAVIGATION: Переход на Explore
    const exploreButton = document.getElementById("exploreButton");

    if (exploreButton) {
        exploreButton.addEventListener("click", () => {
            playButtonSound("explore");

            setTimeout(() => {
                window.location.href = "explore/";
            }, 120);
        });
    }

    // INNER NAVIGATION: Кнопки Home / Discover / Explore
    document.querySelectorAll("[data-nav-sound]").forEach(button => {
        button.addEventListener("click", () => {
            playButtonSound(button.dataset.navSound);
        });
    });

    // LANGUAGE BUTTON: Отдельный звук
    const languageButton = document.getElementById("languageButton");

    if (languageButton) {
        languageButton.addEventListener("click", () => {
            playButtonSound("language");
        });
    }
});
