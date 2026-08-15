// VOTZET ROUTER 1.0
// Экспериментальная SPA-навигация для ветки spa-test

(() => {

    // ROUTER CACHE: Загруженные страницы храним в памяти
    const pageCache = new Map();

    // ROUTER STATE
    let currentPage = "home";

    // PRELOAD: Заранее получаем внутренние страницы
    async function preloadPage(name, url) {

        if (pageCache.has(name)) {
            return;
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(
                    `Unable to load ${url}`
                );
            }

            const html = await response.text();

            const parser =
                new DOMParser();

            const documentData =
                parser.parseFromString(
                    html,
                    "text/html"
                );

            pageCache.set(
                name,
                documentData
            );

        } catch (error) {

            console.error(
                "VotZet Router preload error:",
                error
            );
        }
    }

    // HOME: Главный экран уже находится в текущем DOM
    const home =
        document.getElementById("home");

    if (!home) {
        return;
    }

    // VIEW CONTAINER: Здесь будут появляться Discover и Explore
    const view =
        document.createElement("div");

    view.id =
        "votzetView";

    view.style.display =
        "none";

    document.body.insertBefore(
        view,
        document.body.firstChild
    );

    // SHOW HOME
    function showHome() {

        currentPage =
            "home";

        view.style.display =
            "none";

        home.style.display =
            "";

        history.pushState(
            { page: "home" },
            "",
            "./"
        );
    }

    // SHOW EXTERNAL PAGE INSIDE CURRENT DOCUMENT
    async function showPage(
        name,
        url
    ) {

        home.style.display =
            "none";

        view.style.display =
            "block";

        // Если страницы ещё нет в памяти — загружаем
        if (!pageCache.has(name)) {

            await preloadPage(
                name,
                url
            );
        }

        const page =
            pageCache.get(name);

        // Если загрузить не удалось — используем обычный переход
        if (!page) {
            window.location.href =
                url;

            return;
        }

        currentPage =
            name;

        // Берём содержимое BODY страницы
        view.innerHTML =
            page.body.innerHTML;

        // Исправляем относительные пути внутренних страниц
        view
            .querySelectorAll(
                "a[href]"
            )
            .forEach(link => {

                const href =
                    link.getAttribute("href");

                if (
                    href === "../index.html" ||
                    href === "../"
                ) {
                    link.dataset.route =
                        "home";
                }

                if (
                    href === "../discover/" ||
                    href === "./" &&
                    name === "discover"
                ) {
                    link.dataset.route =
                        "discover";
                }

                if (
                    href === "../explore/" ||
                    href === "./" &&
                    name === "explore"
                ) {
                    link.dataset.route =
                        "explore";
                }
            });

        history.pushState(
            { page: name },
            "",
            name === "discover"
                ? "discover/"
                : "explore/"
        );

        window.scrollTo(
            0,
            0
        );
    }

    // ROUTER CLICK HANDLER
    document.addEventListener(
        "click",
        event => {

            const routeLink =
                event.target.closest(
                    "[data-route]"
                );

            if (!routeLink) {
                return;
            }

            event.preventDefault();

            const route =
                routeLink.dataset.route;

            if (route === "home") {
                showHome();
            }

            if (route === "discover") {
                showPage(
                    "discover",
                    "discover/"
                );
            }

            if (route === "explore") {
                showPage(
                    "explore",
                    "explore/"
                );
            }
        }
    );

    // BROWSER BACK/FORWARD
    window.addEventListener(
        "popstate",
        event => {

            const page =
                event.state?.page ||
                "home";

            if (page === "home") {

                view.style.display =
                    "none";

                home.style.display =
                    "";

                currentPage =
                    "home";

                return;
            }

            if (page === "discover") {
                showPage(
                    "discover",
                    "discover/"
                );
            }

            if (page === "explore") {
                showPage(
                    "explore",
                    "explore/"
                );
            }
        }
    );

    // INITIAL STATE
    history.replaceState(
        { page: "home" },
        "",
        window.location.href
    );

    // BACKGROUND PRELOAD
    preloadPage(
        "discover",
        "discover/"
    );

    preloadPage(
        "explore",
        "explore/"
    );

    // PUBLIC API
    window.VotZetRouter = {
        home: showHome,

        discover: () =>
            showPage(
                "discover",
                "discover/"
            ),

        explore: () =>
            showPage(
                "explore",
                "explore/"
            )
    };

})();
