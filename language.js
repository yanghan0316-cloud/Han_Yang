(() => {
  const toggle = document.querySelector('.language-toggle');
  if (!toggle) return;

  const storageKey = 'han-yang-language';
  const attributes = ['alt', 'aria-label', 'content'];
  // Keep the authored Chinese markup as the default and restoration source.
  const translations = Array.from(document.querySelectorAll(
    '[data-en], [data-en-alt], [data-en-aria-label], [data-en-content]'
  ), (element) => ({
    element,
    chineseHTML: element.hasAttribute('data-en') ? element.innerHTML : null,
    englishHTML: element.getAttribute('data-en'),
    attributes: attributes
      .filter((attribute) => element.hasAttribute(`data-en-${attribute}`))
      .map((attribute) => ({
        name: attribute,
        chinese: element.getAttribute(attribute),
        english: element.getAttribute(`data-en-${attribute}`),
      })),
  }));

  function setLanguage(language) {
    const english = language === 'en';
    for (const translation of translations) {
      if (translation.englishHTML !== null) {
        // Translations contain only trusted, locally authored markup.
        translation.element.innerHTML = english
          ? translation.englishHTML : translation.chineseHTML;
      }
      for (const attribute of translation.attributes) {
        translation.element.setAttribute(attribute.name,
          english ? attribute.english : attribute.chinese);
      }
    }

    document.documentElement.lang = english ? 'en' : 'zh-CN';
    document.querySelector('meta[property="og:locale"]').content = english ? 'en_US' : 'zh_CN';
    toggle.textContent = english ? '中文' : 'EN';
    toggle.lang = english ? 'zh-CN' : 'en';
    toggle.setAttribute('aria-label', english ? '切换为中文' : 'Switch to English');
    toggle.title = english ? '切换为中文' : 'Switch to English';
  }

  let savedLanguage;
  try {
    savedLanguage = localStorage.getItem(storageKey);
  } catch {
    // Browsers that block storage can still switch languages for this visit.
  }
  setLanguage(savedLanguage === 'en' ? 'en' : 'zh-CN');
  toggle.hidden = false;

  toggle.addEventListener('click', () => {
    const language = document.documentElement.lang === 'en' ? 'zh-CN' : 'en';
    setLanguage(language);
    try {
      localStorage.setItem(storageKey, language);
    } catch {
      // Saving a preference is optional; it must not block the switch.
    }
  });
})();
