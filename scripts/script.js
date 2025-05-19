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

// Пример кода из задания
const songsContainer = document.querySelector('.songs-container');
const addButton = document.querySelector('.input__btn_action_add');
const artistInput = document.querySelector('.input__text_type_artist');
const titleInput = document.querySelector('.input__text_type_title');

function addSong(artistValue, titleValue) {
  try {
    const songTemplate = document.querySelector('#song-template')?.content;
    if (!songTemplate) {
      console.error('Шаблон песни не найден');
      return;
    }
    
    const songElement = songTemplate.cloneNode(true);

    songElement.querySelector('.song__artist').textContent = artistValue;
    songElement.querySelector('.song__title').textContent = titleValue;
    songElement.querySelector('.song__like').addEventListener('click', function (evt) {
      evt.target.classList.toggle('song__like_active');
    });

    songsContainer?.append(songElement);
    if (artistInput) artistInput.value = '';
    if (titleInput) titleInput.value = '';
  } catch (error) {
    console.error('Ошибка при добавлении песни:', error.message);
  }
}

function keyHandler(evt) {
  // Выводим в консоль код каждой нажатой клавиши
  console.log(evt.key);
  
  // Проверяем, является ли нажатая клавиша буквой "ё" или "Ё"
  if (evt.key === 'ё' || evt.key === 'Ё') {
    // Предотвращаем ввод запрещенных букв
    evt.preventDefault();
    console.warn('Попытка ввода запрещенной буквы:', evt.key);
  } else if (evt.key === 'Enter') {
    // Если нажата клавиша Enter, добавляем песню
    if (artistInput && titleInput) {
      addSong(artistInput.value, titleInput.value);
    }
  }
}

// Инициализация с добавлением обработчиков из примера
function initSongForm() {
  try {
    if (addButton) {
      addButton.addEventListener('click', function () {
        if (artistInput && titleInput) {
          addSong(artistInput.value, titleInput.value);
        }
      });
    }

    if (artistInput) {
      artistInput.addEventListener('keydown', keyHandler);
    }
    
    if (titleInput) {
      titleInput.addEventListener('keydown', keyHandler);
    }
  } catch (error) {
    console.error('Ошибка при инициализации формы песен:', error.message);
  }
}

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
    console.error('Ошибка при инициализации темы:', error.message);
    // Запасной вариант при ошибке
    setTheme(THEMES.AUTO, false);
  }
})();

// Обработчик загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  try {
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
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleSystemThemeChange);
    } else {
      // Для старых браузеров
      mediaQueryList.addListener(handleSystemThemeChange);
    }

    // Анимация появления контента при загрузке
    animateContentAppearance();
    
    // Инициализация загрузки изображений
    initImageLoading();
    
    // Блокировка букв "ё" и "Ё" во всех текстовых полях
    initTextInputFilters();
    
    // Инициализация формы песен из примера
    initSongForm();
  } catch (error) {
    console.error('Ошибка при инициализации страницы:', error.message);
  }
});

// Анимация появления контента
function animateContentAppearance() {
  try {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add(ANIMATION_CLASSES.FADE_IN);
      }, index * 100); // Задержка для каждой секции
    });
  } catch (error) {
    console.error('Ошибка при анимации контента:', error.message);
  }
}

// Получение текущей темы
function getCurrentTheme() {
  try {
    const themeClass = [...document.documentElement.classList]
      .find(cn => cn.startsWith('theme-'))
      ?.replace('theme-', '');
    return themeClass || THEMES.AUTO;
  } catch (error) {
    console.error('Ошибка при получении текущей темы:', error.message);
    return THEMES.AUTO;
  }
}

// Обработчик клика по кнопке темы
function handleThemeButtonClick(event) {
  try {
    const chosenTheme = [...this.classList]
      .find(cn => cn.includes('_type_'))
      ?.split('_type_')[1];
    
    if (chosenTheme && Object.values(THEMES).includes(chosenTheme)) {
      // Анимация кнопки
      animateButton(this);
      setTheme(chosenTheme, true);
      setActiveButton(document.querySelectorAll('.header__theme-menu-button'), chosenTheme);
    }
  } catch (error) {
    console.error('Ошибка при обработке клика по кнопке темы:', error.message);
  }
}

// Анимация кнопки
function animateButton(button) {
  try {
    button.classList.add(ANIMATION_CLASSES.FADE_OUT);
    setTimeout(() => {
      button.classList.remove(ANIMATION_CLASSES.FADE_OUT);
      button.classList.add(ANIMATION_CLASSES.FADE_IN);
    }, ANIMATION_DURATION.FADE);
  } catch (error) {
    console.error('Ошибка при анимации кнопки:', error.message);
  }
}

// Обработчик изменения системной темы
function handleSystemThemeChange(e) {
  try {
    const currentTheme = getCurrentTheme();
    if (currentTheme === THEMES.AUTO) {
      setTheme(THEMES.AUTO, true);
    }
  } catch (error) {
    console.error('Ошибка при обработке изменения системной темы:', error.message);
  }
}

// Установка темы
function setTheme(theme, animate = true) {
  try {
    if (!theme || !Object.values(THEMES).includes(theme)) {
      throw new Error('Некорректная тема');
    }

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
    try {
      localStorage.setItem('theme', theme);
    } catch (storageError) {
      console.warn('Не удалось сохранить тему в localStorage:', storageError.message);
    }
  } catch (error) {
    console.error('Ошибка при установке темы:', error.message);
  }
}

// Установка активной кнопки
function setActiveButton(buttonsArray, theme) {
  try {
    if (!buttonsArray || !buttonsArray.length) {
      throw new Error('Не найдены кнопки переключения темы');
    }

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
      const autoButton = Array.from(buttonsArray).find(btn => 
        btn.classList.contains(`${BUTTON_CLASSES.TYPE_PREFIX}${THEMES.AUTO}`)
      );
      
      if (autoButton) {
        autoButton.classList.add(BUTTON_CLASSES.ACTIVE);
        autoButton.setAttribute('disabled', '');
        autoButton.setAttribute('aria-pressed', 'true');
      }
    }
  } catch (error) {
    console.error('Ошибка при установке активной кнопки:', error.message);
  }
}

// Инициализация загрузки изображений
function initImageLoading() {
  try {
    const galleryImages = document.querySelectorAll('.gallery__img');
    
    // Установка порядка анимации для каждого изображения
    galleryImages.forEach((img, index) => {
      img.style.setProperty('--img-order', index);
      
      // Добавление обработчика ошибок загрузки
      img.addEventListener('error', handleImageError);
      
      // Добавление обработчика загрузки для анимации
      img.addEventListener('load', () => {
        img.classList.add(ANIMATION_CLASSES.FADE_IN);
      });
    });
    
    // Оптимизация загрузки изображений с IntersectionObserver
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const dataSrc = img.getAttribute('src');
            
            if (dataSrc) {
              img.src = dataSrc;
            }
            
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });
      
      galleryImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
  } catch (error) {
    console.error('Ошибка при инициализации загрузки изображений:', error.message);
  }
}

// Обработчик ошибок загрузки изображений
function handleImageError(event) {
  try {
    const img = event.target;
    
    // Устанавливаем запасное изображение в виде data-URL
    img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f1b2ce" /%3E%3Ctext x="50" y="50" font-size="14" text-anchor="middle" alignment-baseline="middle" font-family="monospace" fill="%23000028"%3EИзображение недоступно%3C/text%3E%3C/svg%3E';
    
    // Добавляем класс для стилизации ошибки загрузки
    img.classList.add('image-error');
    
    console.warn(`Ошибка загрузки изображения: ${img.alt || 'без описания'}`);
  } catch (error) {
    console.error('Ошибка при обработке ошибки загрузки изображения:', error.message);
  }
}

// Инициализация фильтров текстовых полей
function initTextInputFilters() {
  try {
    // Находим все текстовые поля ввода на странице
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    
    // Добавляем обработчики событий для каждого поля
    textInputs.forEach(input => {
      input.addEventListener('keydown', preventForbiddenLetters);
      input.addEventListener('paste', filterPastedText);
    });
    
    console.log('Фильтры текстовых полей активированы');
  } catch (error) {
    console.error('Ошибка при инициализации фильтров текстовых полей:', error.message);
  }
}

// Предотвращение ввода запрещенных букв
function preventForbiddenLetters(event) {
  try {
    // Логгируем нажатую клавишу для отладки
    console.log(event.key);
    
    // Проверяем, является ли нажатая клавиша буквой "ё" или "Ё"
    if (event.key === 'ё' || event.key === 'Ё') {
      // Отменяем событие ввода
      event.preventDefault();
      console.warn('Попытка ввода запрещенной буквы:', event.key);
    }
  } catch (error) {
    console.error('Ошибка при обработке нажатия клавиши:', error.message);
  }
}

// Фильтрация вставляемого текста
function filterPastedText(event) {
  try {
    // Получаем текст из буфера обмена
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text');
    
    // Проверяем, содержит ли вставляемый текст запрещенные буквы
    if (pastedText.includes('ё') || pastedText.includes('Ё')) {
      // Отменяем встроенную вставку
      event.preventDefault();
      
      // Заменяем запрещенные буквы и вставляем отфильтрованный текст
      const filteredText = pastedText.replace(/[ёЁ]/g, '');
      
      // Вставляем отфильтрованный текст
      document.execCommand('insertText', false, filteredText);
      
      console.warn('Из вставляемого текста удалены запрещенные буквы');
    }
  } catch (error) {
    console.error('Ошибка при обработке вставки текста:', error.message);
  }
}
