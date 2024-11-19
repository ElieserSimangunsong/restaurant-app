
// import { addFavorite, removeFavorite, isFavorite } from './indexedDB.js';
// import fetchRestaurantData from './fetchRestaurants.js';

import fetchRestaurantData from '../../data/fetchRestaurants';
import { addFavorite, isFavorite, removeFavorite } from '../../data/indexedDB';

const Home = {
  async render() {
    return `
        <section class="hero">
        <img src="./images/heros/hero-image_2.jpg" alt="Hero Image" />
        <div class="hero__content">
          <h2>Welcome to Hunyu App Resto</h2>
          <p>Explore our best restaurants!</p>
        </div>
      </section>
      <section class="restaurant-list">
        <h2>Explore Restaurants</h2>
        <div id="restaurants"></div>
      </section>
        `;
  },

  async afterRender() {
    const restaurantContainer = document.querySelector('#restaurants');

    const restaurants = await fetchRestaurantData();
    for (const restaurant of restaurants) {
      const favorite = await isFavorite(restaurant.id);
      restaurantContainer.innerHTML += `
      <div class="restaurant-item">
        <img class="restaurant-item__thumbnail" src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="Image of ${restaurant.name}">
        <div class="restaurant-item__content">
          <h3>${restaurant.name}</h3>
          <p>City: ${restaurant.city}</p>
          <p>Rating: ${restaurant.rating}</p>
          <button class="favorite-button ${favorite ? 'favorited' : ''}" data-id="${restaurant.id}">❤️</button>
          <a href="#/detail/${restaurant.id}" class="detail-link">View Details</a>
        </div>
      </div>
    `;
    }

    document.querySelectorAll('.favorite-button').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const id = event.currentTarget.getAttribute('data-id');
        const isFav = await isFavorite(id);
        if (isFav) {
          await removeFavorite(id);
          button.classList.remove('favorited');
        } else {
          const restaurant = restaurants.find((r) => r.id === id);
          await addFavorite(restaurant);
          button.classList.add('favorited');
        }
      });
    });

  },
};

export default Home;