const BASE_URL = 'https://restcountries.com/v2/name/';

const params = new URLSearchParams({
  fields: 'name,capital,population,languages,flags',
});
console.log(params);
export function fetchCountries(name) {
  return fetch(`${BASE_URL}${name}?${params}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
