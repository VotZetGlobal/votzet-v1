// MAIN SYSTEM: Стабильные звуки, навигация и предварительная загрузка VotZet

document.addEventListener("DOMContentLoaded", () => {

    let audioContext = null;

    // AUDIO CORE: Создание AudioContext
    function getAudioContext() {
        if (!audioContext) {
            audioContext =
                new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume().catch(() => {});
        }

        return audioContext;
    }

    // AUDIO: Воспроизведение короткого сигнала
    function playTone(type) {
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;

            // EXPLORE SOUND
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

            // DISCOVER SOUND
            if (type === "discover") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(620, now);
                osc.frequency.exponentialRampToValueAtTime(
                    980,
                    now + 0.09
                );
            }

            // HOME SOUND
            else if (type === "home") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(740, now);
                osc.frequency.exponentialRampToValueAtTime(
                    460,
                    now + 0.09
                );
            }

            // LANGUAGE SOUND
            else if (type === "language") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(1450, now);
                osc.frequency.exponentialRampToValueAtTime(
                    2100,
                    now + 0.055
                );
            }

            // DOCUMENT / WORLD SOUND
            else if (type === "document") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(1050, now);
                osc.frequency.exponentialRampToValueAtTime(
                    1380,
                    now + 0.075
                );
            }

            else {
                return;
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

    // PUBLIC SOUND API: Для Explore и других страниц
    window.VotZetSound = function(type) {
        playTone(type);
    };

    // PREFETCH CORE: Предварительная загрузка
    function warm(url) {
        fetch(url, {
            method: "GET",
            cache: "force-cache",
            credentials: "same-origin"
        }).catch(() => {});
    }

    function prefetch(url) {
        if (
            document.querySelector(
                `link[data-votzet-prefetch="${url}"]`
            )
        ) {
            return;
        }

        const link = document.createElement("link");

        link.rel = "prefetch";
        link.href = url;

        link.setAttribute(
            "data-votzet-prefetch",
            url
        );

        document.head.appendChild(link);
    }

    // PAGE DETECTION
    const path = window.location.pathname;

    const isHome =
        path === "/" ||
        path.endsWith("/index.html");

    const isDiscover =
        path.includes("/discover");

    const isExplore =
        path.includes("/explore");

    // HOME PREFETCH
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

    // DISCOVER PREFETCH
    if (isDiscover) {
        warm("../index.html");
        warm("../explore/");

        prefetch("../index.html");
        prefetch("../explore/");
    }

    // EXPLORE PREFETCH
    if (isExplore) {
        warm("../index.html");
        warm("../discover/");

        prefetch("../index.html");
        prefetch("../discover/");
    }

    // LANGUAGE PREFETCH
    document
        .querySelectorAll(".language-option")
        .forEach(option => {

            option.addEventListener("click", () => {

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
            });
        });

    // HOME: DISCOVER
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

    // HOME: EXPLORE
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

    // LANGUAGE BUTTON
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

    // INTERNAL NAVIGATION: Home / Explore / Discover
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

    // DOCUMENT OPEN
    document.addEventListener(
        "pointerdown",
        event => {

            const button =
                event.target.closest(
                    ".document-button"
                );

            if (
                button &&
                !button.disabled
            ) {
                playTone("document");
            }
        }
    );

    // DOCUMENT CLOSE
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
