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

            // EXPLORE SOUND: Трёхчастный crystalline-аккорд
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

            // DISCOVER SOUND: Восходящий сигнал
            if (type === "discover") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(620, now);
                osc.frequency.exponentialRampToValueAtTime(
                    980,
                    now + 0.09
                );
            }

            // HOME SOUND: Мягкий нисходящий сигнал
            if (type === "home") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(740, now);
                osc.frequency.exponentialRampToValueAtTime(
                    460,
                    now + 0.09
                );
            }

            // LANGUAGE SOUND: Высокий короткий сигнал
            if (type === "language") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(1450, now);
                osc.frequency.exponentialRampToValueAtTime(
                    2100,
                    now + 0.055
                );
            }

            // DOCUMENT SOUND: Открытие документа или World
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
            console.warn(
                "VotZet audio unavailable:",
                error
            );
        }
    }

    // SOUND ROUTER: Доступ к звукам из других страниц VotZet
    window.VotZetSound = function(type) {
        playTone(type);
    };

    // PREFETCH CORE: Предварительная загрузка страницы или JSON в кеш
    function warm(url) {
        fetch(url, {
            method: "GET",
            cache: "force-cache",
            credentials: "same-origin"
        }).catch(() => {});
    }

    // PREFETCH LINK: Подсказка браузеру заранее подготовить страницу
    function prefetch(url) {
        if (
            document.querySelector(
                `link[data-votzet-prefetch="${url}"]`
            )
        ) {
            return;
        }

        const link =
            document.createElement("link");

        link.rel =
            "prefetch";

        link.href =
            url;

        link.setAttribute(
            "data-votzet-prefetch",
            url
        );

        document.head.appendChild(link);
    }

    // PAGE DETECTION: Определяем текущую страницу
    const path =
        window.location.pathname;

    const isHome =
        path === "/" ||
        path.endsWith("/index.html");

    const isDiscover =
        path.includes("/discover");

    const isExplore =
        path.includes("/explore");

    // HOME PREFETCH: На главной заранее готовим Discover, Explore и локализацию
    if (isHome) {
        const language =
            localStorage.getItem("votzet-language") || "en";

        prefetch("discover/");
        prefetch("explore/");

        warm("discover/");
        warm("explore/");

        warm(
            `locales/${language}/common.json`
        );

        warm(
            `locales/${language}/discover.json`
        );
    }

    // DISCOVER PREFETCH: На Discover заранее готовим Home и Explore
    if (isDiscover) {
        warm("../index.html");
        warm("../explore/");

        prefetch("../index.html");
        prefetch("../explore/");
    }

    // EXPLORE PREFETCH: На Explore заранее готовим Home и Discover
    if (isExplore) {
        warm("../index.html");
        warm("../discover/");

        prefetch("../index.html");
        prefetch("../discover/");
    }

    // LANGUAGE PREFETCH: После выбора языка сразу готовим его JSON
    document
        .querySelectorAll(".language-option")
        .forEach(option => {

            option.addEventListener(
                "click",
                () => {

                    const language =
                        option.dataset.language;

                    if (!language) {
                        return;
                    }

                    warm(
                        `locales/${language}/common.json`
                    );

                    warm(
                        `locales/${language}/discover.json`
                    );

                    prefetch("discover/");
                    prefetch("explore/");
                }
            );
        });

    // HOME DISCOVER: Звук при касании и мгновенный переход
    const discoverButton =
        document.getElementById("discoverButton");

    if (discoverButton) {
        discoverButton.addEventListener(
            "pointerdown",
            () => {
                playTone("discover");
            }
        );

        discoverButton.addEventListener(
            "click",
            event => {
                event.preventDefault();

                window.location.href =
                    "discover/";
            }
        );
    }

    // HOME EXPLORE: Звук при касании и мгновенный переход
    const exploreButton =
        document.getElementById("exploreButton");

    if (exploreButton) {
        exploreButton.addEventListener(
            "pointerdown",
            () => {
                playTone("explore");
            }
        );

        exploreButton.addEventListener(
            "click",
            event => {
                event.preventDefault();

                window.location.href =
                    "explore/";
            }
        );
    }

    // LANGUAGE BUTTON: Звук открытия выбора языка
    const languageButton =
        document.getElementById("languageButton");

    if (languageButton) {
        languageButton.addEventListener(
            "pointerdown",
            () => {
                playTone("language");
            }
        );
    }

    // INTERNAL NAVIGATION: Home / Explore / Discover на внутренних страницах
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

    // DOCUMENT OPEN: Звук открытия Mission / Vision / остальных документов
    document.addEventListener(
        "pointerdown",
        event => {

            const button =
                event.target.closest(
                    ".document-button"
                );

            if (button) {
                playTone("document");
            }
        }
    );

    // DOCUMENT CLOSE: Звук закрытия окна документа
    document.addEventListener(
        "pointerdown",
        event => {

            const closeButton =
                event.target.closest(
                    ".modal-close"
                );

            if (closeButton) {
                playTone("home");
            }
        }
    );
});
