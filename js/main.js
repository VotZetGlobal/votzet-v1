// MAIN NAVIGATION: Переходы между основными экранами

document.addEventListener("DOMContentLoaded", () => {

    const discoverButton = document.getElementById("discoverButton");
    const exploreButton = document.getElementById("exploreButton");

    if (discoverButton) {
        discoverButton.addEventListener("click", () => {
            window.location.href = "discover/";
        });
    }

    if (exploreButton) {
        exploreButton.addEventListener("click", () => {
            window.location.href = "explore/";
        });
    }

});
