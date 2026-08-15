// MAIN SYSTEM: Навигация и первоначальные звуки VotZet

document.addEventListener("DOMContentLoaded", () => {

    let audioContext = null;

    // AUDIO: Создание или восстановление AudioContext
    function getAudioContext() {
        if (!audioContext) {
            audioContext =
                new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        return audioContext;
    }

    // DISCOVER SOUND: Восходящий crystalline-сигнал
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

    // EXPLORE SOUND: Трёхчастный crystalline-аккорд
    function playExploreSound() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        [880, 1320, 1760].forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(
                0.065 / (index + 1),
                now + 0.01
            );
            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now + 0.45
            );

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.48);
        });
    }

    // HOME SOUND: Нисходящий мягкий crystalline-сигнал
    function playHomeSound() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.25);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.065, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.43);
    }

    // LANGUAGE SOUND: Короткий высокий metallic-crystalline сигнал
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

    // HOME PAGE: Discover
    const discoverButton =
        document.getElementById("discoverButton");

    if (discoverButton) {
        discoverButton.addEventListener("click", event => {
            event.preventDefault();
            playDiscoverSound();

            setTimeout(() => {
                window.location.href = "discover/";
            }, 120);
        });
    }

    // HOME PAGE: Explore
    const exploreButton =
        document.getElementById("exploreButton");

    if (exploreButton) {
        exploreButton.addEventListener("click", event => {
            event.preventDefault();
            playExploreSound();

            setTimeout(() => {
                window.location.href = "explore/";
            }, 120);
        });
    }

    // LANGUAGE: Звук кнопки выбора языка
    const languageButton =
        document.getElementById("languageButton");

    if (languageButton) {
        languageButton.addEventListener("click", () => {
            playLanguageSound();
        });
    }

    // INTERNAL NAVIGATION: Home / Explore / Discover
    document.querySelectorAll("[data-nav-sound]")
        .forEach(link => {

            link.addEventListener("click", event => {

                const sound =
                    link.dataset.navSound;

                const destination =
                    link.getAttribute("href");

                event.preventDefault();

                if (sound === "home") {
                    playHomeSound();
                }

                if (sound === "discover") {
                    playDiscoverSound();
                }

                if (sound === "explore") {
                    playExploreSound();
                }

                setTimeout(() => {
                    window.location.href = destination;
                }, 120);
            });
        });
});
