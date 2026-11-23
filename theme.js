(() => {
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const root = document.documentElement;
  const storageKey = "portfolio-theme";
  let manualTheme;
  let toggle;

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") manualTheme = saved;
  } catch {
    // Theme switching still works when storage is unavailable.
  }

  function applyTheme() {
    const theme = manualTheme ?? (systemTheme.matches ? "dark" : "light");
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#10090e" : "#fff7f6";

    if (toggle) {
      const label = theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro";
      toggle.setAttribute("aria-label", label);
      toggle.title = label;
    }
  }

  applyTheme();
  systemTheme.addEventListener("change", applyTheme);

  document.addEventListener("DOMContentLoaded", () => {
    toggle = document.querySelector(".theme-toggle");
    toggle.addEventListener("click", () => {
      manualTheme = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(storageKey, manualTheme);
      } catch {
        // Keep the choice for this page.
      }
      applyTheme();
    });
    applyTheme();
    toggle.hidden = false;
  });
})();
