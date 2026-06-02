console.log('hi');

(function () {
    console.log('hello');
    const toggle = document.getElementById('theme-toggle');
    const toggles = document.querySelectorAll('.theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    function updateIcons(theme) {
        const isDark = theme === 'dark';
        if (isDark) {
          darkIcon.style.display = 'none';
          lightIcon.style.display = 'flex';
        } else {
          darkIcon.style.display = 'flex';
          lightIcon.style.display = 'none';
        }

        toggle.setAttribute('aria-pressed', isDark);
        toggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    }

    const isDark = document.documentElement.className.indexOf("dark") !== -1;
    const currentTheme = isDark ? 'dark' : 'light';

    // const appliedTheme =
    // document.documentElement.style.getPropertyValue('color-scheme') || currentTheme;
    //
    updateIcons(currentTheme);

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.className.indexOf("dark") !== -1;
        debugger;
        console.log('udpating theme', document.documentElement.classList, isDark);
        const newTheme = isDark ? 'light' : 'dark';
        document.documentElement.classList.remove(isDark ? 'dark' : 'light');
        document.documentElement.classList.add(newTheme);
        try {
          localStorage.setItem('theme', newTheme);
        } catch (e) {}
        updateIcons(newTheme);
    });
})();
