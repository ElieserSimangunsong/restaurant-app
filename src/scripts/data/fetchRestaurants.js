const BASE_URL = 'https://restaurant-api.dicoding.dev';

async function fetchRestaurantData() {
  try {
    const response = await fetch(`${BASE_URL}/list`);
    const data = await response.json();
    return data.restaurants;
  } catch (error) {
    console.error('Failed to fetch restaurant data:', error);
    return [];
  }
}

export default fetchRestaurantData;
