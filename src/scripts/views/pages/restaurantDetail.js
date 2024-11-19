import { addFavorite, removeFavorite, isFavorite } from '../../data/indexedDB';
import UrlParser from '../../routes/url-parser';
// import '../styles/main.css';
const BASE_URL = 'https://restaurant-api.dicoding.dev';

const RestaurantDetail = {
  async render() {
    return `
      <section class="restaurant-detail">
      <h2 id="restaurant-name"></h2>
      <img id="restaurant-image" alt="Restaurant Image" />
      <p><strong>Address:</strong> <span id="restaurant-address"></span></p>
      <p><strong>City:</strong> <span id="restaurant-city"></span></p>
      <p id="restaurant-description"></p>
      
      <h3>Menus</h3>
      <div>
        <h4>Foods</h4>
        <ul id="food-menu"></ul>
        <h4>Drinks</h4>
        <ul id="drink-menu"></ul>
      </div>

      <h3>Customer Reviews</h3>
      <div id="customer-reviews"></div>
      <div id="add-review">
        <h3>Add Your Review</h3>
        <form id="review-form">
          <input type="text" id="review-name" placeholder="Your Name" required>
          <textarea id="review-text" placeholder="Your Review" required></textarea>
          <button type="submit">Submit Review</button>
        </form>
      </div>

      <button id="favorite-button">❤️</button>
    </section>
    `;
  },
  async afterRender() {
    const url = UrlParser.parseActiveUrlWithoutCombiner();
    const restaurantId = url.id;
    if (!restaurantId) return;

    const restaurant = await fetchRestaurantDetail(restaurantId);
    if (!restaurant) return;

    document.getElementById('restaurant-name').textContent = restaurant.name;
    document.getElementById('restaurant-image').src = `${BASE_URL}/images/medium/${restaurant.pictureId}`;
    document.getElementById('restaurant-address').textContent = restaurant.address;
    document.getElementById('restaurant-city').textContent = restaurant.city;
    document.getElementById('restaurant-description').textContent = restaurant.description;

    const foodMenu = document.getElementById('food-menu');
    restaurant.menus.foods.forEach((food) => {
      const listItem = document.createElement('li');
      listItem.textContent = food.name;
      foodMenu.appendChild(listItem);
    });

    const drinkMenu = document.getElementById('drink-menu');
    restaurant.menus.drinks.forEach((drink) => {
      const listItem = document.createElement('li');
      listItem.textContent = drink.name;
      drinkMenu.appendChild(listItem);
    });

    const reviewsContainer = document.getElementById('customer-reviews');
    const displayReviews = (reviews) => {
      reviewsContainer.innerHTML = '';
      reviews.forEach((review) => {
        const reviewItem = document.createElement('div');
        reviewItem.innerHTML = `<p><strong>${review.name}</strong>: ${review.review}</p><p><em>${review.date}</em></p>`;
        reviewsContainer.appendChild(reviewItem);
      });
    };
    displayReviews(restaurant.customerReviews);

    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = document.getElementById('review-name').value;
      const reviewText = document.getElementById('review-text').value;
      const newReview = {
        name: name,
        review: reviewText,
      };

      const postResult = await postReview(restaurantId, newReview);
      if (postResult && postResult.customerReviews) {

        displayReviews(postResult.customerReviews);
      } else {
        console.error('Failed to post review');
      }

      reviewForm.reset();
    });

    const favoriteButton = document.getElementById('favorite-button');
    const favorite = await isFavorite(restaurant.id);

    favoriteButton.addEventListener('click', async () => {
      if (await isFavorite(restaurant.id)) {
        await removeFavorite(restaurant.id);
        favoriteButton.textContent = '❤️';
      } else {
        await addFavorite(restaurant);
        favoriteButton.textContent = 'Remove ❤️';
      }
    });
  },
};

async function fetchRestaurantDetail(id) {
  try {
    const response = await fetch(`${BASE_URL}/detail/${id}`);
    const data = await response.json();
    return data.restaurant;
  } catch (error) {
    console.error('Failed to fetch restaurant details:', error);
    return null;
  }
}

async function postReview(restaurantId, reviewData) {
  try {
    const response = await fetch(`${BASE_URL}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: restaurantId,
        name: reviewData.name,
        review: reviewData.review,
      }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to post review:', error);
    return null;
  }
}

export default RestaurantDetail;


