import { winWidth, overlayEl, bodyEl, currentScrollTop } from './common.js';

export function initSlider() {
  const bodyEl = document.querySelector('body');

  if (!bodyEl.classList.contains('main-page')) {
    return;
  }

  // Slider
  const sliderWrapper       = document.querySelector('.pets__slider-wrapper');
  const slider              = document.querySelector('.pets__slider');
  const sliderBtnNext       = document.querySelector('.pets__slider-btn_next');
  const sliderBtnPrev       = document.querySelector('.pets__slider-btn_prev');
  const sliderIndexesArray  = [0, 1, 2, 3, 4, 5, 6, 7];
  const mediaQueryTablet    = window.matchMedia('(width <= 1040px)');
  const mediaQueryMobile    = window.matchMedia('(width <= 730px)');

  let sliderInPage = 3;
  let indexesArrayCopy    = sliderIndexesArray.slice();
  let visibleSlidesArray  = [];
  let prevArrayLeft = [];
  let prevArrayRight = [];
  let pets = new Object();

  slider.innerHTML = '';

  if (winWidth > 1040) {
    sliderInPage = 3;
  }

  if (winWidth <= 1040) {
    sliderInPage = 2;
  }

  if (winWidth <= 730) {
    sliderInPage = 1;
  }

  const getJson = async () => {
    const response = await fetch('./assets/json/pets.json');
    pets = await response.json();
    addSlidersBlocks('left');
  }

  const shuffleArray = (arr) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = arr[i];
      arr[i] = arr[j];
      arr[j] = k;
    }
  }

  const buildSlides = (arr, direction) => {
    visibleSlidesArray.length = 0;                      // Clear visibleSlidesArray

    for (let i = 0; i < sliderInPage; i++) {
      const liElement = document.createElement('li');
      liElement.classList.add('pets__slider-item');

      const articleElement = document.createElement('article');
      articleElement.classList.add('pets__slider-card');
      articleElement.setAttribute('data-index', arr[0]);

      const imgElement = document.createElement('img');
      imgElement.classList.add('pets__slider-img');
      imgElement.setAttribute('src', pets[arr[0]].img);
      imgElement.setAttribute('alt', pets[arr[0]].name);

      const h4Element = document.createElement('h4');
      h4Element.classList.add('pets__slider-card-title');
      h4Element.textContent = pets[arr[0]].name;

      const btnElement = document.createElement('button');
      btnElement.classList.add('pets__card-btn', 'oval-button', 'oval-button_contur');
      btnElement.textContent = 'Learn more';

      articleElement.append(imgElement);
      articleElement.append(h4Element);
      articleElement.append(btnElement);
      liElement.append(articleElement);

      if (direction === 'left') {
        slider.append(liElement);
        visibleSlidesArray.push(arr[0]);
      } else if (direction === 'right') {
        slider.prepend(liElement);
        visibleSlidesArray.unshift(arr[0]);
      }

      arr.splice(0, 1);
    }
  }

  const addSlidersBlocks = (direction) => {
    if (direction === 'left') {
      prevArrayLeft = visibleSlidesArray.slice().reverse();

      if (prevArrayRight.length > 0) {
        buildSlides(prevArrayRight, direction);
        return;
      }

      prevArrayRight.length = 0;
    } else if (direction === 'right') {
      prevArrayRight = visibleSlidesArray.slice();

      if (prevArrayLeft.length > 0) {
        buildSlides(prevArrayLeft, direction);
        return;
      }

      prevArrayLeft.length = 0;
    } else {
      console.log('Wrong direction');
      return;
    }

    buildSlides(indexesArrayCopy, direction);
  }

  const delSlides = (from) => {
    const slidesArr = slider.querySelectorAll('.pets__slider-item');

    if (from === 'left') {
      for (let i = 0; i < sliderInPage; i++) { // Remove first slides from begining
        slidesArr[i].remove();
      }
    }

    if (from === 'right') {
      for (let i = 0; i < sliderInPage; i++) { // Remove last slides from end
        slidesArr[slidesArr.length - 1 - i].remove();
      }
    }
  }

  const delCurrentIndexes = () => {
    visibleSlidesArray.forEach(arrItem => {
      const index = indexesArrayCopy.indexOf(arrItem);
      indexesArrayCopy.splice(index, 1);
    });
  }

  const rebuildIndexesArray = () => {
    indexesArrayCopy = sliderIndexesArray.slice();
    shuffleArray(indexesArrayCopy);
    delCurrentIndexes();
  }

  const sliderShiftLeft = () => {
    rebuildIndexesArray();

    addSlidersBlocks('left');
    slider.classList.add('pets__slider_shift-left');
  }

  const sliderShiftRight = () => {
    rebuildIndexesArray();

    addSlidersBlocks('right');
    slider.classList.add('pets__slider_shift-right');
  }

  const sliderNext = () => {
    sliderShiftLeft();
    sliderBtnNext.removeEventListener('click', sliderNext);
  }

  const sliderPrev = () => {
    sliderShiftRight();
    sliderBtnPrev.removeEventListener('click', sliderPrev);
  }

  const reBuildSlider = () => {
    slider.innerHTML = '';
    prevArrayRight.length = 0;
    prevArrayLeft.length = 0;
    indexesArrayCopy = sliderIndexesArray.slice();
    shuffleArray(indexesArrayCopy);
    buildSlides(indexesArrayCopy, 'left');
  }

  const widthToggleTablet = (mediaQuery) => {
    if (mediaQuery.matches) {
      sliderInPage = 2;
      reBuildSlider();
    } else {
      sliderInPage = 3;
      reBuildSlider();
    }
  }

  const widthToggleMobile = (mediaQuery) => {
    if (mediaQuery.matches) {
      sliderInPage = 1;
      reBuildSlider();
    } else {
      sliderInPage = 2;
      reBuildSlider();
    }
  }

  const widthLessTablet = () => {
    widthToggleTablet(mediaQueryTablet);
  }

  const widthLessMobile = () => {
    widthToggleMobile(mediaQueryMobile);
  }

  // Listeners
  sliderBtnNext.addEventListener('click', sliderNext);
  sliderBtnPrev.addEventListener('click', sliderPrev);

  slider.addEventListener('animationend', (animationEvent) => {
    if (animationEvent.animationName === 'slide-left') {
      delSlides('left');
      slider.classList.remove('pets__slider_shift-left');
    }

    if (animationEvent.animationName === 'slide-right') {
      delSlides('right');
      slider.classList.remove('pets__slider_shift-right');
    }

    sliderBtnNext.addEventListener('click', sliderNext);
    sliderBtnPrev.addEventListener('click', sliderPrev);
  });

  mediaQueryTablet.addEventListener('change', widthLessTablet); // Tablet/Desktop toggle
  mediaQueryMobile.addEventListener('change', widthLessMobile); // Mobile/Tablet toggle

  // Start
  shuffleArray(indexesArrayCopy);
  getJson();
}