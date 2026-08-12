// LANGUAGE SYSTEM: Система выбора языка VotZet

document.addEventListener("DOMContentLoaded", () => {

    const languageButton = document.getElementById("languageButton");
    const languageSelector = document.getElementById("languageSelector");
    const languageOptions = document.querySelectorAll(".language-option");

    if (!languageButton || !languageSelector) {
        return;
    }

    const translations = {
        en: {
            home: "Home",
            discover: "Discover",
            explore: "Explore",
            chooseLanguage: "Choose language"
        },
        ru: {
            home: "Главная",
            discover: "Открыть",
            explore: "Исследовать",
            chooseLanguage: "Выбрать язык"
        },
        es: {
            home: "Inicio",
            discover: "Descubrir",
            explore: "Explorar",
            chooseLanguage: "Elegir idioma"
        },
        fr: {
            home: "Accueil",
            discover: "Découvrir",
            explore: "Explorer",
            chooseLanguage: "Choisir la langue"
        },
        de: {
            home: "Startseite",
            discover: "Entdecken",
            explore: "Erkunden",
            chooseLanguage: "Sprache wählen"
        },
        it: {
            home: "Home",
            discover: "Scopri",
            explore: "Esplora",
            chooseLanguage: "Scegli la lingua"
        },
        pt: {
            home: "Início",
            discover: "Descobrir",
            explore: "Explorar",
            chooseLanguage: "Escolher idioma"
        },
        el: {
            home: "Αρχική",
            discover: "Ανακαλύψτε",
            explore: "Εξερευνήστε",
            chooseLanguage: "Επιλέξτε γλώσσα"
        }
    };

    const languageNames = {
        en: "English",
        ru: "Русский",
        es: "Español",
        fr: "Français",
        de: "Deutsch",
        it: "Italiano",
        pt: "Português",
        el: "Ελληνικά",
        tr: "Türkçe",
        nl: "Nederlands",
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

    function applyLanguage(language) {

        const selected = translations[language] || translations.en;

        document.documentElement.lang = language;

        if (discoverButtonExists()) {
            document.getElementById("discoverButton").textContent = selected.discover;
        }

        if (exploreButtonExists()) {
            document.getElementById("exploreButton").textContent = selected.explore;
        }

        languageButton.textContent = `${languageNames[language] || "English"} ▾`;

        localStorage.setItem("votzet-language", language);
    }

    function discoverButtonExists() {
        return document.getElementById("discoverButton") !== null;
    }

    function exploreButtonExists() {
        return document.getElementById("exploreButton") !== null;
    }

    languageButton.addEventListener("click", (event) => {

        event.stopPropagation();

        languageSelector.classList.toggle("open");

    });

    languageOptions.forEach(option => {

        option.addEventListener("click", (event) => {

            event.stopPropagation();

            const language = option.dataset.language;

            applyLanguage(language);

            languageSelector.classList.remove("open");

        });

    });

    document.addEventListener("click", () => {

        languageSelector.classList.remove("open");

    });

    const savedLanguage = localStorage.getItem("votzet-language") || "en";

    applyLanguage(savedLanguage);

});
