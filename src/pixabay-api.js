'use strict';

import axios from 'axios';
console.log(axios);
export class UnsplashAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '32898879-9fd6f99f665dcbb95d5335d80';

  constructor() {
    this.page = 1;
    this.q = null;
  }

  fetchPhotosByQuery() {
    const searchParams = {
      params: {
        q: this.q,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        key: UnsplashAPI.API_KEY,
      },
    };

    return axios.get(`${UnsplashAPI.BASE_URL}`, searchParams);
  }
}
