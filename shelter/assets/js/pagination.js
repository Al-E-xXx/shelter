import { winWidth, bodyEl } from './common.js';

export function initPagination() {
  const bodyEl = document.querySelector('body');

  if (!bodyEl.classList.contains('pets-page')) {
    return;
  }

  // Pagination
  const ourFriendsCardsWrapperEl = document.querySelector('.our-friends__cards-wrapper');
  const sliderIndexesArray      = [0, 1, 2, 3, 4, 5, 6, 7];
  const pageCounterEl           = document.querySelector('.our-friends__btn_counter');
  const toBeginingBtn           = document.getElementById('to-begining-btn');
  const prevBtn                 = document.getElementById('prev-btn');
  const nextBtn                 = document.getElementById('next-btn');
  const toEndBtn                = document.getElementById('to-end-btn');
  const mediaQueryTablet        = window.matchMedia('(width <= 1024px)');
  const mediaQueryMobile        = window.matchMedia('(width <= 640px)');

  let indexesArray48            = [];
  let indexesArray48Shuffle     = [];
  let cardsInPage               = 8;
  let pagesCounter              = 1;
  let showFromId = 0;
  let pets = {};

  // Произвольный префикс для LocalStorage
  const LS_PREFIX = 'pets_app_';
  const LS_KEY = `${LS_PREFIX}indexesArray48Shuffle`;

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = arr[i];
      arr[i] = arr[j];
      arr[j] = k;
    }
  }

  const getJson = async () => {
    const response = await fetch('./assets/json/pets.json');
    pets = await response.json();

    console.log('indexesArray48Shuffle:');
    console.log(indexesArray48Shuffle);

    buildCards(indexesArray48Shuffle, showFromId);
  }

  if (winWidth > 1024) {
    cardsInPage = 8;
  }

  if (winWidth <= 1024) {
    cardsInPage = 6;
  }

  if (winWidth <= 640) {
    cardsInPage = 3;
  }

  for (let i = 0; i < 6; i++) {
    indexesArray48 = indexesArray48.concat(sliderIndexesArray);
  }

  const build48Array = () => {
    let counter = 0;
    let arr4 = [];
    for (let i = 0; i < indexesArray48.length; i++) {
      arr4.push(indexesArray48[i]);
      counter++;

      if (counter === 4) {
        shuffleArray(arr4);
        indexesArray48Shuffle = indexesArray48Shuffle.concat(arr4);
        counter = 0;
        arr4 = [];
      }
    }
  }

  const buildCards = (arr, fromId) => {
    ourFriendsCardsWrapperEl.innerHTML = '';

    for (let i = 0; i < cardsInPage; i++) {
      const articleElement = document.createElement('article');
      articleElement.classList.add('our-friends__card');
      articleElement.setAttribute('data-index', arr[i + fromId]);

      const imgElement = document.createElement('img');
      imgElement.classList.add('our-friends__img');
      imgElement.setAttribute('src', pets[arr[i + fromId]].img);
      imgElement.setAttribute('alt', pets[arr[i + fromId]].name);

      const h4Element = document.createElement('h4');
      h4Element.classList.add('our-friends__card-title');
      h4Element.textContent = pets[arr[i + fromId]].name;

      const btnElement = document.createElement('button');
      btnElement.classList.add('our-friends__card-btn');
      btnElement.textContent = 'Learn more';

      articleElement.append(imgElement);
      articleElement.append(h4Element);
      articleElement.append(btnElement);
      ourFriendsCardsWrapperEl.append(articleElement);
    }

    pagesCounter = Math.ceil(fromId / cardsInPage + 1);
    pageCounterEl.textContent = pagesCounter;

    // Disable/Enable paginations buttons
    if (pagesCounter === 1) {
      toBeginingBtn.disabled = true;
      prevBtn.disabled = true;

      toBeginingBtn.classList.add('round-btn_disabled');
      prevBtn.classList.add('round-btn_disabled');
    } else {
      toBeginingBtn.disabled = false;
      prevBtn.disabled = false;

      toBeginingBtn.classList.remove('round-btn_disabled');
      prevBtn.classList.remove('round-btn_disabled');
    }

    if (pagesCounter * cardsInPage >= indexesArray48Shuffle.length) {
      nextBtn.disabled = true;
      nextBtn.classList.add('round-btn_disabled');

      toEndBtn.disabled = true;
      toEndBtn.classList.add('round-btn_disabled');
    } else {
      nextBtn.disabled = false;
      nextBtn.classList.remove('round-btn_disabled');

      toEndBtn.disabled = false;
      toEndBtn.classList.remove('round-btn_disabled');
    }
  }

  const nextPage = () => {
    if (showFromId + cardsInPage < indexesArray48Shuffle.length) {
      showFromId += cardsInPage;
      buildCards(indexesArray48Shuffle, showFromId);
    } else {
      return;
    }
  }

  const toTheEnd = () => {
    showFromId = indexesArray48Shuffle.length - cardsInPage;
    buildCards(indexesArray48Shuffle, showFromId);
  }

  const prevPage = () => {
    if (showFromId - cardsInPage >= 0) {
      showFromId -= cardsInPage;
    } else {
      showFromId = 0;
    }

    buildCards(indexesArray48Shuffle, showFromId);
  }

  const toTheBegining = () => {
    showFromId = 0;
    buildCards(indexesArray48Shuffle, showFromId);
  }

  const checkId = () => {
    if (showFromId + cardsInPage > indexesArray48Shuffle.length) {
      showFromId = indexesArray48Shuffle.length - cardsInPage;
    }
    buildCards(indexesArray48Shuffle, showFromId);
  }

  const widthToggleTablet = (mediaQuery) => {
    if (mediaQuery.matches) {
      cardsInPage = 6;
      checkId();
    } else {
      cardsInPage = 8;
      checkId();
    }
  }

  const widthToggleMobile = (mediaQuery) => {
    if (mediaQuery.matches) {
      cardsInPage = 3;
      checkId();
    } else {
      cardsInPage = 6;
      checkId();
    }
  }

  const widthLessTablet = () => {
    widthToggleTablet(mediaQueryTablet);
  }

  const widthLessMobile = () => {
    widthToggleMobile(mediaQueryMobile);
  }

  // Listeners
  nextBtn.addEventListener('click', nextPage);
  toEndBtn.addEventListener('click', toTheEnd);
  prevBtn.addEventListener('click', prevPage);
  toBeginingBtn.addEventListener('click', toTheBegining);

  mediaQueryTablet.addEventListener('change', widthLessTablet);
  mediaQueryMobile.addEventListener('change', widthLessMobile);

  // Start
  const storedArray = localStorage.getItem(LS_KEY);

  if (storedArray) {
    try {
      const parsedArray = JSON.parse(storedArray);
      if (Array.isArray(parsedArray) && parsedArray.length > 0) {
        // Если массив успешно прочитан и не пустой - используем его
        indexesArray48Shuffle = parsedArray;
      } else {
        // Если пустой массив - генерируем новый
        build48Array();
        localStorage.setItem(LS_KEY, JSON.stringify(indexesArray48Shuffle));
      }
    } catch (e) {
      // Если в LocalStorage невалидный JSON, пересоздаем и сохраняем
      build48Array();
      localStorage.setItem(LS_KEY, JSON.stringify(indexesArray48Shuffle));
    }
  } else {
    // Если ключа в LS нет, генерируем и сохраняем
    build48Array();
    localStorage.setItem(LS_KEY, JSON.stringify(indexesArray48Shuffle));
  }

  getJson();
}