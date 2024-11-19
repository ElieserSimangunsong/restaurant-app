import { getFavorites } from '../../data/indexedDB';
import { addFavorite, removeFavorite, isFavorite } from '../../data/indexedDB';
// import '../styles/main.css';

const Favorite = {
  async render() {
    return `
        <section class="restaurant-list">
      <h2>Your Favorites</h2>
      <div class="favorites"></div>
    </section>
        `;
  },
  async afterRender() {

    const favoriteContainer = document.querySelector('.favorites');
    const favorites = await getFavorites();
    let favoriteContent = '';

    if (favorites.length) {
      favorites.forEach((restaurant) => {
        favoriteContent += `
        <div class="restaurant-item" data-id="${restaurant.id}">
          <img class="restaurant-item__thumbnail" src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" alt="Image of ${restaurant.name}">
          <div class="restaurant-item__content">
            <h3>${restaurant.name}</h3>
            <p>City: ${restaurant.city}</p>
            <p>Rating: ${restaurant.rating}</p>
            <button class="favorite-button">Remove ❤️</button>
            <a href="#/detail/${restaurant.id}" class="detail-link">View Details</a>
          </div>
        </div>
      `;
      });
    } else {
      favoriteContent = '<p>No favorite restaurants yet.</p>';
    }

    favoriteContainer.innerHTML = favoriteContent;

    document.querySelectorAll('.favorite-button').forEach((button, index) => {
      button.addEventListener('click', async () => {
        const restaurant = favorites[index];
        const isFav = await isFavorite(restaurant.id);
        if (isFav) {
          await removeFavorite(restaurant.id);
          const restaurantElement = document.querySelector(`.restaurant-item[data-id="${restaurant.id}"]`);

          if (restaurantElement) {
            restaurantElement.remove();
          }
        }
      });
    });
  },
};

export default Favorite;

// document.addEventListener('DOMContentLoaded', async () => {

// });

// document.querySelectorAll('.skip-link, .drawer-list a').forEach((link) => {
//   link.addEventListener('click', () => {
//     drawer.classList.remove('open');
//   });
// });

// const menuButton = document.getElementById('menuButton');
// const drawer = document.getElementById('drawer');

// menuButton.addEventListener('click', (event) => {
//   const isOpen = drawer.classList.toggle('open');
//   menuButton.setAttribute('aria-expanded', isOpen);
//   event.stopPropagation();
// });

// document.addEventListener('click', () => {
//   drawer.classList.remove('open');
//   menuButton.setAttribute('aria-expanded', 'false');
// });

// document.querySelectorAll('.skip-link, .drawer-list a').forEach((link) => {
//   link.addEventListener('click', () => {
//     drawer.classList.remove('open');
//   });
// });
