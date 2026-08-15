// MAIN SYSTEM: Быстрая навигация, предварительная загрузка и звуки VotZet

document.addEventListener("DOMContentLoaded", () => {

    let audioContext = null;

    // AUDIO CORE: Создание и активация AudioContext
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
        osc.frequency.exponentialRampToValueAtTime(
            980,
            now + 0.18
        );

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(
            0.075,
            now + 0.012
        );
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.28
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.30);
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
                0.06 / (index + 1),
                now + 0.008
            );

            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now + 0.24
            );

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.26);
        });
    }

    // HOME SOUND: Мягкий нисходящий crystalline-сигнал
    function playHomeSound() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";

        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(
            420,
            now + 0.18
        );

        gain.gain.setValueAtTime(0.0001, now);

        gain.gain.exponentialRampToValueAtTime(
            0.065,
            now + 0.01
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.25
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.27);
    }

    // LANGUAGE SOUND: Короткий metallic-crystalline сигнал
    function playLanguageSound() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";

        osc.frequency.setValueAtTime(1450, now);
        osc.frequency.exponentialRampToValueAtTime(
            2100,
            now + 0.065
        );

        gain.gain.setValueAtTime(0.0001, now);

        gain.gain.exponentialRampToValueAtTime(
            0.045,
            now + 0.005
        );

        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.13
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // SOUND ROUTER: Выбор звука для конкретной кнопки
    function playSound(type) {

        if (type === "discover") {
            playDiscoverSound();
        }

        if (type === "explore") {
            playExploreSound();
        }

        if (type === "home") {
            playHomeSound();
        }

        if (type === "language") {
            playLanguageSound();
        }
    }

    // PREFETCH: Предварительно загружаем основные страницы
    function prefetchPage(url) {

        const link =
            document.createElement("link");

        link.rel =
            "prefetch";

        link.href =
            url;

        document.head.appendChild(link);
    }

    if (
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("/index.html")
    ) {
        prefetchPage("discover/");
        prefetchPage("explore/");
    }

    // HOME DISCOVER: Звук начинается уже при касании
    const discoverButton =
        document.getElementById("discoverButton");

    if (discoverButton) {

        discoverButton.addEventListener(
            "pointerdown",
            () => {
                playDiscoverSound();
            }
        );

        discoverButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                setTimeout(() => {
                    window.location.href =
                        "discover/";
                }, 65);
            }
        );
    }

    // HOME EXPLORE: Звук начинается уже при касании
    const exploreButton =
        document.getElementById("exploreButton");

    if (exploreButton) {

        exploreButton.addEventListener(
            "pointerdown",
            () => {
                playExploreSound();
            }
        );

        exploreButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                setTimeout(() => {
                    window.location.href =
                        "explore/";
                }, 65);
            }
        );
    }

    // LANGUAGE: Звук выбора языка
    const languageButton =
        document.getElementById("languageButton");

    if (languageButton) {

        languageButton.addEventListener(
            "pointerdown",
            () => {
                playLanguageSound();
            }
        );
    }

    // INTERNAL NAVIGATION: Home / Explore / Discover
    document
        .querySelectorAll("[data-nav-sound]")
        .forEach(link => {

            const sound =
                link.dataset.navSound;

            link.addEventListener(
                "pointerdown",
                () => {
                    playSound(sound);
                }
            );

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const destination =
                        link.getAttribute("href");

                    setTimeout(() => {
                        window.location.href =
                            destination;
                    }, 65);
                }
            );
        });
});
