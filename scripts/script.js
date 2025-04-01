// Константы для тем
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Классы для кнопок
const BUTTON_CLASSES = {
  ACTIVE: 'header__theme-menu-button_active',
  TYPE_PREFIX: 'header__theme-menu-button_type_'
};

// Классы для анимаций
const ANIMATION_CLASSES = {
  FADE_IN: 'fade-in',
  FADE_OUT: 'fade-out',
  SLIDE_IN: 'slide-in',
  SLIDE_OUT: 'slide-out',
  THEME_TRANSITION: 'theme-transition'
};

// Длительность анимаций в миллисекундах
const ANIMATION_DURATION = {
  FADE: 300,
  SLIDE: 400,
  THEME: 500
};

// Инициализация темы при загрузке
(function initTheme() {
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      setTheme(savedTheme, false); // false означает, что это начальная загрузка
    } else {
      // Если тема не сохранена или некорректна, используем системные предпочтения
      setTheme(THEMES.AUTO, false);
    }
  } catch (error) {
    console.error('Ошибка при инициализации темы:', error);
    setTheme(THEMES.AUTO, false);
  }
})();

// Обработчик загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const themeButtons = document.querySelectorAll('.header__theme-menu-button');
  const currentTheme = getCurrentTheme();
  
  // Добавляем класс для анимации перехода темы
  document.documentElement.classList.add(ANIMATION_CLASSES.THEME_TRANSITION);
  
  // Установка активной кнопки
  setActiveButton(themeButtons, currentTheme);

  // Добавление обработчиков событий
  themeButtons.forEach(button => {
    button.addEventListener('click', handleThemeButtonClick);
  });

  // Слушатель изменения системной темы
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);

  // Анимация появления контента при загрузке
  animateContentAppearance();
});

// Анимация появления контента
function animateContentAppearance() {
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    setTimeout(() => {
      section.classList.add(ANIMATION_CLASSES.FADE_IN);
    }, index * 100); // Задержка для каждой секции
  });
}

// Получение текущей темы
function getCurrentTheme() {
  const themeClass = [...document.documentElement.classList]
    .find(cn => cn.startsWith('theme-'))
    ?.replace('theme-', '');
  return themeClass || THEMES.AUTO;
}

// Обработчик клика по кнопке темы
function handleThemeButtonClick() {
  const chosenTheme = [...this.classList]
    .find(cn => cn.includes('_type_'))
    ?.split('_type_')[1];
  
  if (chosenTheme && Object.values(THEMES).includes(chosenTheme)) {
    // Анимация кнопки
    animateButton(this);
    setTheme(chosenTheme, true);
    setActiveButton(document.querySelectorAll('.header__theme-menu-button'), chosenTheme);
  }
}

// Анимация кнопки
function animateButton(button) {
  button.classList.add(ANIMATION_CLASSES.FADE_OUT);
  setTimeout(() => {
    button.classList.remove(ANIMATION_CLASSES.FADE_OUT);
    button.classList.add(ANIMATION_CLASSES.FADE_IN);
  }, ANIMATION_DURATION.FADE);
}

// Обработчик изменения системной темы
function handleSystemThemeChange(e) {
  const currentTheme = getCurrentTheme();
  if (currentTheme === THEMES.AUTO) {
    setTheme(THEMES.AUTO, true);
  }
}

// Установка темы
function setTheme(theme, animate = true) {
  try {
    if (animate) {
      // Анимация перехода темы
      document.documentElement.classList.add(ANIMATION_CLASSES.THEME_TRANSITION);
      setTimeout(() => {
        document.documentElement.classList.remove(ANIMATION_CLASSES.THEME_TRANSITION);
      }, ANIMATION_DURATION.THEME);
    }

    // Очистка всех классов темы
    document.documentElement.classList.remove(
      ...Array.from(document.documentElement.classList)
        .filter(cn => cn.startsWith('theme-'))
    );

    if (theme === THEMES.AUTO) {
      // Определение системной темы
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(`theme-${prefersDark ? THEMES.DARK : THEMES.LIGHT}`);
    } else {
      document.documentElement.classList.add(`theme-${theme}`);
    }

    // Сохранение выбранной темы
    localStorage.setItem('theme', theme);
  } catch (error) {
    console.error('Ошибка при установке темы:', error);
  }
}

// Установка активной кнопки
function setActiveButton(buttonsArray, theme) {
  try {
    // Сброс состояния всех кнопок
    buttonsArray.forEach(button => {
      button.classList.remove(BUTTON_CLASSES.ACTIVE);
      button.removeAttribute('disabled');
      button.setAttribute('aria-pressed', 'false');
    });

    // Поиск и активация целевой кнопки
    const targetButton = buttonsArray.find(button =>
      button.classList.contains(`${BUTTON_CLASSES.TYPE_PREFIX}${theme}`)
    );

    if (targetButton) {
      targetButton.classList.add(BUTTON_CLASSES.ACTIVE);
      targetButton.setAttribute('disabled', '');
      targetButton.setAttribute('aria-pressed', 'true');
    } else {
      // Если кнопка не найдена, активируем автоматическую тему
      const autoButton = document.querySelector(`${BUTTON_CLASSES.TYPE_PREFIX}${THEMES.AUTO}`);
      if (autoButton) {
        autoButton.classList.add(BUTTON_CLASSES.ACTIVE);
        autoButton.setAttribute('disabled', '');
        autoButton.setAttribute('aria-pressed', 'true');
      }
    }
  } catch (error) {
    console.error('Ошибка при установке активной кнопки:', error);
  }
}
