// LANGUAGE SYSTEM: Выбор языка только на главной странице и сохранение языка для всех страниц VotZet

document.addEventListener("DOMContentLoaded", () => {
    const languageButton = document.getElementById("languageButton");
    const languageSelector = document.getElementById("languageSelector");
    const languageOptions = document.querySelectorAll(".language-option");
    const discoverButton = document.getElementById("discoverButton");
    const exploreButton = document.getElementById("exploreButton");

    const languageNames = {
        en: "English",
        es: "Español",
        fr: "Français",
        de: "Deutsch",
        it: "Italiano",
        pt: "Português",
        el: "Ελληνικά",
        tr: "Türkçe",
        nl: "Nederlands",
        ru: "Русский",
        ka: "ქართული",
        fi: "Suomi",
        sv: "Svenska",
        no: "Norsk",
        is: "Íslenska",
        ga: "Gaeilge",
        zh: "中文",
        ko: "한국어",
        ja: "日本語",
        tl: "Filipino / Tagalog",
        id: "Bahasa Indonesia",
        vi: "Tiếng Việt",
        th: "ไทย",
        hi: "हिन्दी",
        ar: "العربية"
    };

    const savedLanguage = localStorage.getItem("votzet-language") || "en";

    // HOME LANGUAGE SELECTOR: Работает только на главной странице
    if (languageButton && languageSelector) {

        async function loadHomeLanguage(language) {
            try {
                const response = await fetch(`locales/${language}/common.json`);

                if (!response.ok) {
                    throw new Error(`Language file not found: ${language}`);
                }

                const translations = await response.json();

                document.documentElement.lang = language;

                if (discoverButton && translations.discover) {
                    discoverButton.textContent = translations.discover;
                }

                if (exploreButton && translations.explore) {
                    exploreButton.textContent = translations.explore;
                }

                languageButton.textContent =
                    `${languageNames[language] || languageNames.en} ▾`;

                localStorage.setItem("votzet-language", language);

            } catch (error) {
                console.error("VotZet language error:", error);

                if (language !== "en") {
                    loadHomeLanguage("en");
                }
            }
        }

        languageButton.addEventListener("click", (event) => {
            event.stopPropagation();
            languageSelector.classList.toggle("open");
        });

        languageOptions.forEach(option => {
            option.addEventListener("click", (event) => {
                event.stopPropagation();

                const language = option.dataset.language;

                loadHomeLanguage(language);

                languageSelector.classList.remove("open");
            });
        });

        document.addEventListener("click", () => {
            languageSelector.classList.remove("open");
        });

        loadHomeLanguage(savedLanguage);
    }

    // OTHER PAGES: Используем язык, выбранный на главной странице
    document.documentElement.lang = savedLanguage;
});
