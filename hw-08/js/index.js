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
const addItems = galleryItems.reduce((acc, item) => {
  return (acc += `<li class="gallery__item">
  <a
  class="gallery__link"
  href="${item.original}"
  >
  <img
  class="gallery__image"
  src="${item.preview}"
  data-source="${item.original}"
  alt="${item.description}"
  />
  </a>
  </li>`);
}, "");


galleryList.insertAdjacentHTML("afterbegin", addItems);
galleryList.addEventListener("click", handleClick);
lightBox.addEventListener("click", handleClose);
document.addEventListener("keydown", handleKeyPress);

// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// Открытие модального окна по клику на элементе галереи.

function handleClick(e) {
  e.preventDefault();
  lightBox.classList.add("is-open");
  lightBoxImage.src = e.target.dataset.source;
}

// Подмена значения атрибута src элемента img.lightbox__image.

function handleClose(e) {
  e.preventDefault();
  if (e.target === lightBoxImage) {
    return;
  }
  lightBox.classList.remove("is-open");
  lightBoxImage.src = "";
}

function allowedKey(key) {
  const ALLOWED_KEYS = ['Escape', 'ArrowRight', 'ArrowLeft'];
  return ALLOWED_KEYS.includes(key);
}

// Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем 
// открытии модального окна, пока грузится изображение, мы не видели предыдущее cтартовые файлы

// Дополнительно

// Закрытие модального окна по клику на div.lightbox__overlay.
// Закрытие модального окна по нажатию клавиши ESC.
// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

function handleKeyPress(e) {
  if (!allowedKey(e.code)) {
    return;
  }

  if (e.code === "Escape") {
    lightBox.classList.remove("is-open");
    lightBoxImage.src = "";
    return;
  }
  let idx;
  const currentImg = galleryItems.find((item, _idx) => {
    idx = _idx;
    return item.original === lightBoxImage.src;
  });
  if (e.code === "ArrowRight") {
    idx += 1;
  }
  if (e.code === "ArrowLeft") {
    idx -= 1;
  }
  if (idx < 0) {
    idx = galleryItems.length - 1;
  }
  if (idx > galleryItems.length - 1) {
    idx = 0;
  }
  lightBoxImage.src = galleryItems[idx].original;
}
