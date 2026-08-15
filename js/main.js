// MAIN SYSTEM: Звуки, навигация и предварительная загрузка VotZet

document.addEventListener("DOMContentLoaded", () => {

    let audioContext = null;

    // AUDIO CORE: Создание AudioContext
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

    // AUDIO HELPER: Создание короткого сигнала
    function playTone(type) {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            if (type === "explore") {
                [880, 1320, 1760].forEach((freq, index) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, now);

                    gain.gain.setValueAtTime(0.0001, now);
                    gain.gain.exponentialRampToValueAtTime(
                        0.055 / (index + 1),
                        now + 0.006
                    );
                    gain.gain.exponentialRampToValueAtTime(
                        0.0001,
                        now + 0.11
                    );

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(now);
                    osc.stop(now + 0.12);
                });

                return;
            }

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            if (type === "discover") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(620, now);
                osc.frequency.exponentialRampToValueAtTime(
                    980,
                    now + 0.09
                );
            }

            if (type === "home") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(740, now);
                osc.frequency.exponentialRampToValueAtTime(
                    460,
                    now + 0.09
                );
            }

            if (type === "language") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(1450, now);
                osc.frequency.exponentialRampToValueAtTime(
                    2100,
                    now + 0.055
                );
            }

            if (type === "document") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(1050, now);
                osc.frequency.exponentialRampToValueAtTime(
                    1380,
                    now + 0.075
                );
            }

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(
                type === "language" ? 0.04 : 0.06,
                now + 0.005
            );
            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now + 0.11
            );

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.12);

        } catch (error) {
            console.warn("VotZet audio unavailable:", error);
        }
    }

    // SOUND ROUTER: Доступен всему сайту
    window.VotZetSound = function(type) {
        playTone(type);
    };

    // PREFETCH: Прогрев URL в HTTP-кеше
    function warm(url) {
        fetch(url, {
            method: "GET",
            cache: "force-cache"
        }).catch(() => {});
    }

    // PREFETCH HOME: Подготавливаем следующие страницы заранее
    const path = window.location.pathname;

    if (
        path === "/" ||
        path.endsWith("/index.html")
    ) {
        const language =
            localStorage.getItem("votzet-language") || "en";

        warm("discover/");
        warm("explore/");
        warm(`locales/${language}/common.json`);
        warm(`locales/${language}/discover.json`);
    }

    // LANGUAGE PREFETCH: После выбора языка прогреваем его данные
    document
        .querySelectorAll(".language-option")
        .forEach(option => {

            option.addEventListener("click", () => {

                const language =
                    option.dataset.language;

                if (!language) {
                    return;
                }

                warm(`locales/${language}/common.json`);
                warm(`locales/${language}/discover.json`);
            });
        });

    // HOME DISCOVER: Звук начинается при касании, переход без искусственной паузы
    const discoverButton =
        document.getElementById("discoverButton");

    if (discoverButton) {

        discoverButton.addEventListener(
            "pointerdown",
            () => playTone("discover")
        );

        discoverButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                window.location.href = "discover/";
            }
        );
    }

    // HOME EXPLORE: То же для Explore
    const exploreButton =
        document.getElementById("exploreButton");

    if (exploreButton) {

        exploreButton.addEventListener(
            "pointerdown",
            () => playTone("explore")
        );

        exploreButton.addEventListener(
            "click",
            event => {
                event.preventDefault();
                window.location.href = "explore/";
            }
        );
    }

    // LANGUAGE BUTTON: Звук выбора языка
    const languageButton =
        document.getElementById("languageButton");

    if (languageButton) {
        languageButton.addEventListener(
            "pointerdown",
            () => playTone("language")
        );
    }

    // INTERNAL NAVIGATION: Работает независимо от выбранного языка
    document
        .querySelectorAll("[data-nav-sound]")
        .forEach(link => {

            link.addEventListener(
                "pointerdown",
                () => {
                    playTone(
                        link.dataset.navSound
                    );
                }
            );

            link.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const destination =
                        link.getAttribute("href");

                    window.location.href =
                        destination;
                }
            );
        });

    // DOCUMENT BUTTONS: Делегирование работает и для динамически созданных карточек
    document.addEventListener(
        "pointerdown",
        event => {

            const button =
                event.target.closest(".document-button");

            if (button) {
                playTone("document");
            }
        }
    );
});
