// MAIN SYSTEM: Звуки, навигация и предварительная загрузка VotZet

document.addEventListener("DOMContentLoaded", () => {

    let audioContext = null;
    let audioUnlocked = false;
    let currentSoundPromise = Promise.resolve();

    // AUDIO CORE: Создание и гарантированная разблокировка AudioContext
    async function ensureAudio() {
        if (!audioContext) {
            audioContext =
                new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        if (audioContext.state === "running") {
            audioUnlocked = true;
        }

        return audioContext;
    }

    // AUDIO CORE: Непосредственное создание звука после разблокировки
    async function playTone(type) {
        try {
            const ctx = await ensureAudio();
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
            if (type === "home") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(740, now);
                osc.frequency.exponentialRampToValueAtTime(
                    460,
                    now + 0.09
                );
            }

            // LANGUAGE SOUND
            if (type === "language") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(1450, now);
                osc.frequency.exponentialRampToValueAtTime(
                    2100,
                    now + 0.055
                );
            }

            // DOCUMENT / WORLD SOUND
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

    // SOUND START: Запоминаем Promise первого звука
    function startSound(type) {
        const wasLocked = !audioUnlocked;

        currentSoundPromise = playTone(type);

        return wasLocked;
    }

    // PUBLIC SOUND API: Используется Explore и другими страницами
    window.VotZetSound = function(type) {
        currentSoundPromise = playTone(type);
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

        warm(`locales/${language}/common.json`);
        warm(`locales/${language}/discover.json`);
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

                warm(`locales/${language}/common.json`);
                warm(`locales/${language}/discover.json`);
            });
        });

    // HOME: DISCOVER
    const discoverButton =
        document.getElementById("discoverButton");

    if (discoverButton) {
        let firstAudioUnlock = false;

        discoverButton.addEventListener(
            "pointerdown",
            () => {
                firstAudioUnlock =
                    startSound("discover");
            }
        );

        discoverButton.addEventListener(
            "click",
            async event => {
                event.preventDefault();

                // Только при самом первом звуковом взаимодействии
                // ждём разблокировки AudioContext.
                if (firstAudioUnlock) {
                    await currentSoundPromise;

                    setTimeout(() => {
                        window.location.href =
                            "discover/";
                    }, 90);

                    firstAudioUnlock = false;
                    return;
                }

                window.location.href =
                    "discover/";
            }
        );
    }

    // HOME: EXPLORE
    const exploreButton =
        document.getElementById("exploreButton");

    if (exploreButton) {
        let firstAudioUnlock = false;

        exploreButton.addEventListener(
            "pointerdown",
            () => {
                firstAudioUnlock =
                    startSound("explore");
            }
        );

        exploreButton.addEventListener(
            "click",
            async event => {
                event.preventDefault();

                if (firstAudioUnlock) {
                    await currentSoundPromise;

                    setTimeout(() => {
                        window.location.href =
                            "explore/";
                    }, 90);

                    firstAudioUnlock = false;
                    return;
                }

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
                startSound("language");
            }
        );
    }

    // INTERNAL NAVIGATION: Home / Explore / Discover
    document
        .querySelectorAll("[data-nav-sound]")
        .forEach(link => {

            let firstAudioUnlock = false;

            link.addEventListener(
                "pointerdown",
                () => {
                    firstAudioUnlock =
                        startSound(
                            link.dataset.navSound
                        );
                }
            );

            link.addEventListener(
                "click",
                async event => {
                    event.preventDefault();

                    const destination =
                        link.getAttribute("href");

                    if (firstAudioUnlock) {
                        await currentSoundPromise;

                        setTimeout(() => {
                            window.location.href =
                                destination;
                        }, 90);

                        firstAudioUnlock = false;
                        return;
                    }

                    window.location.href =
                        destination;
                }
            );
        });

    // DOCUMENT OPEN: Mission / Vision / Philosophy / Principles
    document.addEventListener(
        "pointerdown",
        event => {
            const button =
                event.target.closest(".document-button");

            if (button && !button.disabled) {
                startSound("document");
            }
        }
    );

    // DOCUMENT CLOSE
    document.addEventListener(
        "pointerdown",
        event => {
            const closeButton =
                event.target.closest(".modal-close");

            if (closeButton) {
                startSound("home");
            }
        }
    );
});
