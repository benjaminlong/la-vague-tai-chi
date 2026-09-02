(function () {
    const toggles = document.querySelectorAll('.theme-toggle');

    function updateIcons(theme) {
        const isDark = theme === 'dark';
        document.querySelectorAll('.theme-toggle-dark-icon').forEach((el) => {
            el.style.display = isDark ? 'none' : 'flex';
        });
        document.querySelectorAll('.theme-toggle-light-icon').forEach((el) => {
            el.style.display = isDark ? 'flex' : 'none';
        });
        toggles.forEach((t) => {
            t.setAttribute('aria-pressed', isDark);
            t.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
        });
    }

    const startsDark = document.documentElement.className.indexOf('dark') !== -1;
    updateIcons(startsDark ? 'dark' : 'light');

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const isDark = document.documentElement.className.indexOf('dark') !== -1;
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.classList.remove(isDark ? 'dark' : 'light');
            document.documentElement.classList.add(newTheme);
            try {
                localStorage.setItem('theme', newTheme);
            } catch (e) {}
            updateIcons(newTheme);
        });
    });
})();
