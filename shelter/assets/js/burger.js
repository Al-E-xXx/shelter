import { winWidth, overlayEl, bodyEl } from './common.js';

// Burger menu
const burgerBtn             = document.querySelector('.mob-menu-btn');
const menuEl                = document.querySelector('.menu');
const mediaQueryBurger      = window.matchMedia('(width <= 767px)');


const menuShow = () => {
  overlayEl.classList.add('fade-in');
  burgerBtn.classList.add('mob-menu-btn_active');
  menuEl.classList.add('menu_active');
  bodyEl.classList.add('fixed-block');
}

const menuHide = () => {
  overlayEl.classList.add('fade-out');
  burgerBtn.classList.remove('mob-menu-btn_active');
  menuEl.classList.remove('menu_active');
  bodyEl.classList.remove('fixed-block');
}

const burgerClick = () => {
  burgerBtn.removeEventListener('click', burgerClick);

  if (!burgerBtn.classList.contains('mob-menu-btn_active')) {
    menuShow();
  } else {
    menuHide();
  }
}

const menuClickEvent = (event) => {
  if (event.target.classList.contains('menu__link')) {
    event.preventDefault();
    menuHide();

    const goToLink = function() {
      menuEl.removeEventListener('transitionend', goToLink);
      document.location.href = event.target.href;
    };

    menuEl.addEventListener('transitionend', goToLink);
  }
}

const widthToggleBurger = (mediaQuery) => {
  if (!mediaQuery.matches) {
    menuEl.removeEventListener('click', menuClickEvent);

    menuEl.style.display = 'none';
    setTimeout(() => {
      menuEl.style.display = '';
    }, 20);

    burgerBtn.classList.remove('mob-menu-btn_active');
    menuEl.classList.remove('menu_active');
    bodyEl.classList.remove('fixed-block');
    overlayEl.classList.remove('overlay_active');
    overlayEl.classList.remove('fade-out');
    overlayEl.classList.remove('fade-in');
  } else {
    menuEl.addEventListener('click', menuClickEvent);

    menuEl.style.display = 'none';
    setTimeout(() => {
      menuEl.style.display = '';
    }, 20);
  }
}

export function initBurger() {
  burgerBtn.addEventListener('click', burgerClick);
  overlayEl.addEventListener('click', menuHide);
  mediaQueryBurger.addEventListener('change', widthToggleBurger);

  overlayEl.addEventListener('animationend', (animationEvent) => {
    if (animationEvent.animationName === 'fade-in') {
      overlayEl.classList.add('overlay_active');
      overlayEl.classList.remove('fade-in');
    }
    if (animationEvent.animationName === 'fade-out') {
      overlayEl.classList.remove('overlay_active');
      overlayEl.classList.remove('fade-out');
    }
  });

  burgerBtn.addEventListener('transitionend', () => {
    burgerBtn.addEventListener('click', burgerClick);
  });

  if (winWidth < 768) {
    menuEl.addEventListener('click', menuClickEvent);
  }
}

