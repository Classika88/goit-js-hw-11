import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { debounce } from 'lodash';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;
const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');

countryInput.addEventListener(
  'input',
  debounce(debounceFetchCountry, DEBOUNCE_DELAY)
);

function debounceFetchCountry(e) {
  const name = e.target.value.trim();
  if (name !== '') {
    fetchCountries(name)
      .then(country => renderCountry(country))
      .catch(error => {
        if (error.message === '404') {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else {
          Notiflix.Notify.failure(
            `Oops, something went wrong, ${error.message}`
          );
        }
      });
  }
  countryList.innerHTML = '';
}

function renderCountry(country) {
  if (country.length === 1) {
    const markup = country
      .map(({ name, capital, population, flags, languages }) => {
        return `<li>
      <div class="country-info">
      <img src="${flags.svg}" width="25" height="20"/><h2> ${name}<h2></div>
      <p><b>Capital</b>: ${capital}</p>
      <p><b>Population</b>: ${population}</p>
      <p><b>Languages</b>: ${languages.map(a => a.name)} </p>
      </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
  } else if (country.length >= 2 && country.length < 10) {
    const markup = country
      .map(({ name, flags }) => {
        return `<li>
      <div class="country-info">
      <img src="${flags.svg}" widrh="25" height="20"/>
      <h2> ${name}</h2>
      </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
  } else {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}
