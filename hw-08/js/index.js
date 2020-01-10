'use strict'

// Создай галерею с возможностью клика по ее элементам и просмотра полноразмерного изображения в модальном окне. 
// Превью результата посмотри по ссылке.

// Разметка элемента галереи
// Ссылка на оригинальное изображение должна храниться в data-атрибуте source на элементе img, 
// и указываться в href ссылки (это необходимо для доступности).

/* <li class="gallery__item">
  <a
    class="gallery__link"
    href="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546_1280.jpg"
  >
    <img
      class="gallery__image"
      src="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546__340.jpg"
      data-source="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546_1280.jpg"
      alt="Tulips"
    />
  </a>
</li> */

// Превью

// Разбей задание на несколько подзадач:

// Создание и рендер разметки по массиву данных и предоставленному шаблону.

import * as baseList from "./gallery-items.js";
const galleryItems = baseList.default;

const galleryList = document.querySelector(".js-gallery");
const lightBox = document.querySelector(".lightbox");
const lightBoxImage = document.querySelector(".lightbox__image");
const liItems = createLi(galleryItems);
const closeBtn = document.querySelector('[data-action="close-lightbox"]')

function createLi(arr) {
  return arr.reduce((acc, item) => {
    (acc += `
      <li class="gallery__item">
        <a class="gallery__link" href="${item.original}">
          <img 
            class="gallery__image" 
            src="${item.preview}" 
            data-source="${item.original}"
            alt="${item.description}"
          />
        </a>
      </li>`);

    return acc;  
    }, "");
  }

galleryList.insertAdjacentHTML('afterbegin', liItems);

galleryList.addEventListener('click', openImage);
closeBtn.addEventListener('click', closeImage);
lightBox.addEventListener('click', closeByOverlay);

// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// Открытие модального окна по клику на элементе галереи.
// Подмена значения атрибута src элемента img.lightbox__image.

function openImage(e) {
  e.preventDefault();
  if (e.target === e.currentTarget) {
    return;
  }
  const bigURL = e.target.dataset.source;
  const alt = e.target.alt;
  lightBox.classList.add('is-open');
  lightBoxImage.src = bigURL;
  lightBoxImage.alt = alt;

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keydown', handleArrow);
}

// Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем 
// открытии модального окна, пока грузится изображение, мы не видели предыдущее cтартовые файлы

function closeImage() {
  lightBox.classList.remove('is-open');
  lightBoxImage.src = "";
  lightBoxImage.alt = "";

  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keydown', handleArrow);
}

// Дополнительно

// Закрытие модального окна по клику на div.lightbox__overlay.
// Закрытие модального окна по нажатию клавиши ESC.
// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".


function closeByOverlay(e) {
  if (e.target.nodeName !== 'DIV') {
    return;
  }
  closeImage();
}

function handleKeydown(e) {
  if (e.code === 'Escape') {
    closeImage();
  } else {
    return;
  }
}

function handleArrow(e) {
  if (e.code === 'ArrowLeft') {
    const currentSrc = lightBoxImage.src;
    const matchingObj = galleryItems.find(elem => elem.original === currentSrc);
    let resultIdx = galleryItems.indexOf(matchingObj) - 1;
    if (resultIdx < 0) {
      resultIdx = galleryItems.length - 1;
    }
    lightBoxImage.src = galleryItems[resultIdx].original;
  } else if (e.code === 'ArrowRight') {
    const currentSrc = lightBoxImage.src;
    const matchingObj = galleryItems.find(elem => elem.original === currentSrc);
    let resultIdx = galleryItems.indexOf(matchingObj) + 1;
    if (resultIdx > galleryItems.length - 1) {
      resultIdx = 0;
    }
    lightBoxImage.src = galleryItems[resultIdx].original;
  }
}