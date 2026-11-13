/**
 * Gallery lightbox — dependency-free image viewer.
 * Opens on thumbnail click, supports prev/next via buttons, keyboard arrows,
 * Escape to close, and touch swipe on mobile. Neighbours are preloaded.
 */
(function () {
    "use strict";

    const grid = document.getElementById("gallery-grid");
    const lightbox = document.getElementById("gallery-lightbox");
    if (!grid || !lightbox) return;

    const imgEl = lightbox.querySelector("#gallery-lightbox-img");
    const captionEl = lightbox.querySelector("#gallery-lightbox-caption");
    const btnPrev = lightbox.querySelector("[data-lb-prev]");
    const btnNext = lightbox.querySelector("[data-lb-next]");
    const btnClose = lightbox.querySelector("[data-lb-close]");

    // Build the ordered list of images from the grid buttons.
    const items = Array.from(grid.querySelectorAll(".gallery-item")).map((btn) => ({
        full: btn.getAttribute("data-full"),
        alt: btn.getAttribute("data-alt") || "",
        title: btn.getAttribute("data-title") || "",
    }));
    if (!items.length) return;

    let current = 0;
    let lastFocused = null;

    function preload(index) {
        const item = items[index];
        if (item) {
            const img = new Image();
            img.src = item.full;
        }
    }

    function render() {
        const item = items[current];
        imgEl.src = item.full;
        imgEl.alt = item.alt;
        captionEl.textContent = item.title || item.alt || "";
        const single = items.length < 2;
        btnPrev.classList.toggle("hidden", single);
        btnNext.classList.toggle("hidden", single);
        // Preload the neighbours for snappy navigation.
        preload((current + 1) % items.length);
        preload((current - 1 + items.length) % items.length);
    }

    function open(index) {
        current = index;
        lastFocused = document.activeElement;
        render();
        lightbox.classList.remove("hidden");
        lightbox.classList.add("flex");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        btnClose.focus();
    }

    function close() {
        lightbox.classList.add("hidden");
        lightbox.classList.remove("flex");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        imgEl.src = "";
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    function next() {
        current = (current + 1) % items.length;
        render();
    }

    function prev() {
        current = (current - 1 + items.length) % items.length;
        render();
    }

    // Open on thumbnail click.
    grid.addEventListener("click", function (event) {
        const btn = event.target.closest(".gallery-item");
        if (!btn || !grid.contains(btn)) return;
        event.preventDefault();
        const index = Number(btn.getAttribute("data-index"));
        open(Number.isNaN(index) ? 0 : index);
    });

    btnNext.addEventListener("click", next);
    btnPrev.addEventListener("click", prev);
    btnClose.addEventListener("click", close);

    // Click on the dark backdrop (outside the figure) closes the viewer.
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) close();
    });

    // Keyboard navigation while the viewer is open.
    document.addEventListener("keydown", function (event) {
        if (lightbox.classList.contains("hidden")) return;
        switch (event.key) {
            case "Escape":
                close();
                break;
            case "ArrowRight":
                next();
                break;
            case "ArrowLeft":
                prev();
                break;
        }
    });

    // Touch swipe (horizontal) on mobile.
    let touchStartX = 0;
    let touchStartY = 0;
    lightbox.addEventListener("touchstart", function (event) {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
        const dx = event.changedTouches[0].clientX - touchStartX;
        const dy = event.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) next();
            else prev();
        }
    }, { passive: true });
})();
