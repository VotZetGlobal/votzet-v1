// MAIN SYSTEM: Стабильные звуки, навигация и предварительная загрузка VotZet

document.addEventListener("DOMContentLoaded", () => {

    let audioContext = null;

    const NAVIGATION_DELAY = 140;


    // =====================================================
    // AUDIO CORE
    // =====================================================

    function getAudioContext() {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();
        }

        return audioContext;
    }


    // =====================================================
    // AUDIO ACTIVATION
    // =====================================================

    async function activateAudioContext() {

        const ctx =
            getAudioContext();

        if (
            ctx.state === "suspended"
        ) {

            try {

                await ctx.resume();

            } catch (error) {

                console.warn(
                    "VotZet audio activation unavailable:",
                    error
                );

                return null;
            }
        }

        return ctx;
    }


    // =====================================================
    // AUDIO
    // =====================================================

    async function playTone(type) {

        try {

            const ctx =
                await activateAudioContext();

            if (!ctx) {
                return;
            }

            const now =
                ctx.currentTime;


            // =================================================
            // EXPLORE SOUND
            // =================================================

            if (
                type === "explore"
            ) {

                [
                    880,
                    1320,
                    1760
                ].forEach(
                    (freq, index) => {

                        const osc =
                            ctx.createOscillator();

                        const gain =
                            ctx.createGain();

                        osc.type =
                            "sine";

                        osc.frequency.setValueAtTime(
                            freq,
                            now
                        );

                        gain.gain.setValueAtTime(
                            0.0001,
                            now
                        );

                        gain.gain.exponentialRampToValueAtTime(
                            0.055 / (index + 1),
                            now + 0.006
                        );

                        gain.gain.exponentialRampToValueAtTime(
                            0.0001,
                            now + 0.11
                        );

                        osc.connect(
                            gain
                        );

                        gain.connect(
                            ctx.destination
                        );

                        osc.start(
                            now
                        );

                        osc.stop(
                            now + 0.12
                        );
                    }
                );

                return;
            }


            // =================================================
            // STANDARD SOUND
            // =================================================

            const osc =
                ctx.createOscillator();

            const gain =
                ctx.createGain();


            // =================================================
            // DISCOVER SOUND
            // =================================================

            if (
                type === "discover"
            ) {

                osc.type =
                    "triangle";

                osc.frequency.setValueAtTime(
                    620,
                    now
                );

                osc.frequency.exponentialRampToValueAtTime(
                    980,
                    now + 0.09
                );
            }


            // =================================================
            // HOME SOUND
            // =================================================

            else if (
                type === "home"
            ) {

                osc.type =
                    "sine";

                osc.frequency.setValueAtTime(
                    740,
                    now
                );

                osc.frequency.exponentialRampToValueAtTime(
                    460,
                    now + 0.09
                );
            }


            // =================================================
            // LANGUAGE SOUND
            // =================================================

            else if (
                type === "language"
            ) {

                osc.type =
                    "sine";

                osc.frequency.setValueAtTime(
                    1450,
                    now
                );

                osc.frequency.exponentialRampToValueAtTime(
                    2100,
                    now + 0.055
                );
            }


            // =================================================
            // DOCUMENT / WORLD SOUND
            // =================================================

            else if (
                type === "document"
            ) {

                osc.type =
                    "triangle";

                osc.frequency.setValueAtTime(
                    1050,
                    now
                );

                osc.frequency.exponentialRampToValueAtTime(
                    1380,
                    now + 0.075
                );
            }


            else {

                return;
            }


            // =================================================
            // VOLUME
            // =================================================

            gain.gain.setValueAtTime(
                0.0001,
                now
            );

            gain.gain.exponentialRampToValueAtTime(
                type === "language"
                    ? 0.04
                    : 0.06,
                now + 0.005
            );

            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now + 0.11
            );

            osc.connect(
                gain
            );

            gain.connect(
                ctx.destination
            );

            osc.start(
                now
            );

            osc.stop(
                now + 0.12
            );

        } catch (error) {

            console.warn(
                "VotZet audio unavailable:",
                error
            );
        }
    }


    // =====================================================
    // PUBLIC SOUND API
    // =====================================================

    window.VotZetSound =
        function(type) {

            playTone(type);
        };


    // =====================================================
    // SMALL DELAY
    // =====================================================

    function wait(milliseconds) {

        return new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    milliseconds
                );
            }
        );
    }


    // =====================================================
    // NAVIGATION WITH SOUND
    // =====================================================

    async function navigateWithSound(
        soundType,
        destination
    ) {

        /*
           Звук запускается внутри реального click.
           Затем даём ему закончиться до смены страницы.
        */

        await playTone(
            soundType
        );

        await wait(
            NAVIGATION_DELAY
        );

        window.location.href =
            destination;
    }


    // =====================================================
    // PREFETCH CORE
    // =====================================================

    function warm(url) {

        fetch(
            url,
            {
                method: "GET",
                cache: "force-cache",
                credentials: "same-origin"
            }
        ).catch(
            () => {}
        );
    }


    function prefetch(url) {

        if (
            document.querySelector(
                `link[data-votzet-prefetch="${url}"]`
            )
        ) {

            return;
        }

        const link =
            document.createElement(
                "link"
            );

        link.rel =
            "prefetch";

        link.href =
            url;

        link.setAttribute(
            "data-votzet-prefetch",
            url
        );

        document.head.appendChild(
            link
        );
    }


    // =====================================================
    // PAGE DETECTION
    // =====================================================

    const path =
        window.location.pathname;

    const isHome =
        path === "/" ||
        path.endsWith(
            "/index.html"
        );

    const isDiscover =
        path.includes(
            "/discover"
        );

    const isExplore =
        path.includes(
            "/explore"
        );


    // =====================================================
    // HOME PREFETCH
    // =====================================================

    if (isHome) {

        const language =
            localStorage.getItem(
                "votzet-language"
            ) || "en";

        prefetch(
            "discover/"
        );

        prefetch(
            "explore/"
        );

        warm(
            "discover/"
        );

        warm(
            "explore/"
        );

        warm(
            `locales/${language}/common.json`
        );

        warm(
            `locales/${language}/discover.json`
        );

        warm(
            `locales/${language}/explore.json`
        );
    }


    // =====================================================
    // DISCOVER PREFETCH
    // =====================================================

    if (isDiscover) {

        warm(
            "../index.html"
        );

        warm(
            "../explore/"
        );

        prefetch(
            "../index.html"
        );

        prefetch(
            "../explore/"
        );
    }


    // =====================================================
    // EXPLORE PREFETCH
    // =====================================================

    if (isExplore) {

        warm(
            "../index.html"
        );

        warm(
            "../discover/"
        );

        prefetch(
            "../index.html"
        );

        prefetch(
            "../discover/"
        );
    }


    // =====================================================
    // LANGUAGE PREFETCH
    // =====================================================

    document
        .querySelectorAll(
            ".language-option"
        )
        .forEach(
            option => {

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

                        warm(
                            `locales/${language}/explore.json`
                        );
                    }
                );
            }
        );


    // =====================================================
    // HOME: DISCOVER
    // =====================================================

    const discoverButton =
        document.getElementById(
            "discoverButton"
        );

    if (
        discoverButton
    ) {

        discoverButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                if (
                    discoverButton.dataset.busy === "true"
                ) {
                    return;
                }

                discoverButton.dataset.busy =
                    "true";

                await navigateWithSound(
                    "discover",
                    "discover/"
                );
            }
        );
    }


    // =====================================================
    // HOME: EXPLORE
    // =====================================================

    const exploreButton =
        document.getElementById(
            "exploreButton"
        );

    if (
        exploreButton
    ) {

        exploreButton.addEventListener(
            "click",
            async event => {

                event.preventDefault();

                if (
                    exploreButton.dataset.busy === "true"
                ) {
                    return;
                }

                exploreButton.dataset.busy =
                    "true";

                await navigateWithSound(
                    "explore",
                    "explore/"
                );
            }
        );
    }


    // =====================================================
    // LANGUAGE BUTTON
    // =====================================================

    const languageButton =
        document.getElementById(
            "languageButton"
        );

    if (
        languageButton
    ) {

        languageButton.addEventListener(
            "pointerdown",
            () => {

                playTone(
                    "language"
                );
            }
        );
    }


    // =====================================================
    // INTERNAL NAVIGATION
    // =====================================================

    document
        .querySelectorAll(
            "[data-nav-sound]"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    async event => {

                        event.preventDefault();

                        if (
                            link.dataset.busy === "true"
                        ) {
                            return;
                        }

                        link.dataset.busy =
                            "true";

                        const destination =
                            link.getAttribute(
                                "href"
                            );

                        await navigateWithSound(
                            link.dataset.navSound,
                            destination
                        );
                    }
                );
            }
        );


    // =====================================================
    // DOCUMENT OPEN
    // =====================================================

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

                playTone(
                    "document"
                );
            }
        }
    );


    // =====================================================
    // DOCUMENT CLOSE
    // =====================================================

    document.addEventListener(
        "pointerdown",
        event => {

            const closeButton =
                event.target.closest(
                    ".modal-close"
                );

            if (
                closeButton
            ) {

                playTone(
                    "home"
                );
            }
        }
    );

});
