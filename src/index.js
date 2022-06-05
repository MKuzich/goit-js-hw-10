import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
    inputField: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
};
let markupList = '';
let markupInfo = '';

refs.inputField.addEventListener('input', debounce(onInputHandler, DEBOUNCE_DELAY));

console.log(refs.countryList);
console.log(refs.countryInfo);

function onInputHandler(e) {
    const name = e.target.value.trim();
    markupList = '';
    markupInfo = '';

    if (name === '') {
        refs.countryList.innerHTML = markupList;
        refs.countryInfo.innerHTML = markupInfo;
        return;
    }

    fetchCountries(name)
    .then((r) => {
        console.log(r)
        if (r.length > 10) {
            Notify.info('Too many matches found. Please enter a more specific name.');
        } else if (r.length > 1) {
            createListMarkup(r)
        } else if (r.length === 1) {
            createCardMarkup(r)
        } else {
            throw error;
        }
    })
    .catch((error) => Notify.failure('Oops, there is no country with that name'))
    .finally(() => {
        refs.countryList.innerHTML = markupList;
        refs.countryInfo.innerHTML = markupInfo;    
    })
}

function createListMarkup(r) {
    return markupList = r.map(({flags, name}) => {
        return `
        <li class="list__item">
            <img class="list__flag" src="${flags.svg}" alt="${name.official}" width="80">
            <h2 class="list__title">${name.official}</h2>
        </li>
        `})
        .join('');
}

function createCardMarkup(r) {
    return markupInfo = `
    <div class="wrapper">
        <img class="card__flag" src="${r[0].flags.svg}" alt="${r[0].name.official}" width="200">
        <h2 class="card__title">${r[0].name.official}</h2>
    </div>
    <p class="card__description"><span class="descr__wrap">Capital:</span> ${r[0].capital[0]}</p>
    <p class="card__description"><span class="descr__wrap">Population:</span> ${r[0].population}</pclass=>
    <p class="card__description"><span class="descr__wrap">Languages:</span> ${Object.values(r[0].languages)}</p>`
}


