import { winWidth, overlayEl, bodyEl } from './common.js';

const ourFriendsCardsWrapperEl = document.querySelector('.our-friends__cards-wrapper');
const petsSliderWrapperEl = document.querySelector('.pets__slider-wrapper');

export function initPopup() {
  const popupWrapperEl = document.querySelector('.popup-wrapper');
  const popupEl = document.querySelector('.popup');
  const popupCloseBtn = document.querySelector('.popup__close');
  const popupImgWrapperEl = document.querySelector('.popup__img-wrapper');
  const popupContentWrapperEl = document.querySelector('.popup__content-wrapper');
  const ourFriendsCardsWrapperEl = document.querySelector('.our-friends__cards-wrapper');

  let currentScrollTop = scrollY;
  let pets = {};

  const getJson = async () => {
    const response = await fetch('./assets/json/pets.json');
    pets = await response.json();
  }

  const fixBody = () => {
    if (!bodyEl.classList.contains('fixed-block')) {
      currentScrollTop = scrollY;
      bodyEl.classList.add('fixed-block');
      bodyEl.style.top = '-' + currentScrollTop + 'px';
    }
  }

  const unfixBody = () => {
    if (bodyEl.classList.contains('fixed-block')) {
      bodyEl.classList.remove('fixed-block');
      bodyEl.style.top = '';

      window.scrollTo({
        top: currentScrollTop,
        left: 0,
        behavior: 'instant',
      });
    }
  }

  const popupOpen = (e) => {
    const cardEl = e.target.closest('article');

    popupImgWrapperEl.innerHTML = '';
    popupContentWrapperEl.innerHTML = '';

    if (cardEl) {
      const petId = cardEl.getAttribute('data-index');

      if (!popupWrapperEl.classList.contains('popup_on') && petId >= 0) {
        popupWrapperEl.classList.add('popup_on');
        popupWrapperEl.classList.add('fade-in');

        fixBody();

        const imgElement = document.createElement('img');
        imgElement.classList.add('popup__img');
        imgElement.setAttribute('src', pets[petId].img);
        imgElement.setAttribute('alt', pets[petId].name);

        popupImgWrapperEl.append(imgElement);

        const titleElement = document.createElement('h3');
        titleElement.classList.add('popup__title');
        titleElement.textContent = pets[petId].name;

        popupContentWrapperEl.append(titleElement);

        const subTitleElement = document.createElement('h4');
        subTitleElement.classList.add('popup__subtitle');
        subTitleElement.textContent = pets[petId].type + ' - ' + pets[petId].breed;

        popupContentWrapperEl.append(subTitleElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.classList.add('popup__description');
        descriptionElement.textContent = pets[petId].description;

        popupContentWrapperEl.append(descriptionElement);

        const popupListElement = document.createElement('ul');
        popupListElement.classList.add('popup__list');
        popupListElement.innerHTML = `<li class="popup__list-item"><span>Age:</span> ${pets[petId].age}</li>
                                    <li class="popup__list-item"><span>Inoculations:</span> ${pets[petId].inoculations}</li>
                                    <li class="popup__list-item"><span>Diseases:</span> ${pets[petId].diseases}</li>
                                    <li class="popup__list-item"><span>Parasites:</span> ${pets[petId].parasites}</li>`;
        popupContentWrapperEl.append(popupListElement);
      } else {
        return;
      }
    } else {
      return;
    }
  }

  const popupClose = () => {
    if (popupWrapperEl.classList.contains('popup_on')) {
      popupWrapperEl.classList.add('fade-out');
      popupWrapperEl.classList.remove('popup_on');

      unfixBody();
    }
  }

  const popupClick = (e) => {
    if (e.target === e.currentTarget && e.currentTarget.classList.contains('popup-wrapper')) {
      popupClose();
    } else {
      return;
    }
  }

  // Listeners
  if (ourFriendsCardsWrapperEl) {
    ourFriendsCardsWrapperEl.addEventListener('click', popupOpen);
  }

  if (petsSliderWrapperEl) {
    petsSliderWrapperEl.addEventListener('click', popupOpen);
  }

  popupWrapperEl.addEventListener('click', popupClick);
  popupCloseBtn.addEventListener('click', popupClose);

  popupWrapperEl.addEventListener('animationend', (animationEvent) => {
    if (animationEvent.animationName === 'fade-in') {
      popupWrapperEl.classList.add('popup-wrapper_active');
      popupWrapperEl.classList.remove('fade-in');
    }
    if (animationEvent.animationName === 'fade-out') {
      popupWrapperEl.classList.remove('popup-wrapper_active');
      popupWrapperEl.classList.remove('fade-out');
    }
  });

  // Start
  getJson();
}