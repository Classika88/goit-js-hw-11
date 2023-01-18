import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import { UnsplashAPI } from './pixabay-api.js';
import { createGalleryCards } from './gallery-cards.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const searchBtnEl = document.querySelector('.search-btn');

const unsplashAPI = new UnsplashAPI();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  searchBtnEl.disabled = true;
  searchBtnEl.classList.add('disabled');

  unsplashAPI.q = event.target.elements.searchQuery.value;
  unsplashAPI.page = 1;

  try {
    const { data } = await unsplashAPI.fetchPhotosByQuery();

    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      event.target.reset();
      searchBtnEl.disabled = false;
      searchBtnEl.classList.remove('disabled');
      galleryListEl.innerHTML = '';

      return;
    }

    if (data.totalHits / 40 > unsplashAPI.page) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    galleryListEl.innerHTML = createGalleryCards(data.hits);
  } catch (err) {
    console.log(err);
  }

  searchBtnEl.disabled = false;
  searchBtnEl.classList.remove('disabled');
};

const onLoadMoreBtnClick = async event => {
  event.target.disabled = true;
  event.target.classList.add('disabled');

  unsplashAPI.page += 1;

  try {
    const { data } = await unsplashAPI.fetchPhotosByQuery();

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.hits)
    );

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });

    if (data.totalHits / 40 <= unsplashAPI.page) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
    }
  } catch (err) {
    console.log(err);
  }

  event.target.disabled = false;
  event.target.classList.remove('disabled');
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
