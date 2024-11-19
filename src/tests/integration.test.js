import { addFavorite, removeFavorite, getFavorites, isFavorite } from '../scripts/data/indexedDB';

describe('Favorite Restaurants Integration Test', () => {
  const restaurantSample = { id: '1', name: 'Sample Restaurant' };

  beforeEach(async () => {
    // Pastikan database kosong sebelum setiap tes
    const favorites = await getFavorites();
    await Promise.all(favorites.map((fav) => removeFavorite(fav.id)));
  });

  test('Should add a restaurant to favorites', async () => {
    await addFavorite(restaurantSample);
    const favorites = await getFavorites();
    expect(favorites).toContainEqual(restaurantSample);
  });

  test('Should remove a restaurant from favorites', async () => {
    await addFavorite(restaurantSample);
    await removeFavorite(restaurantSample.id);
    const favorites = await getFavorites();
    expect(favorites).not.toContainEqual(restaurantSample);
  });

  test('Should check if a restaurant is in favorites', async () => {
    await addFavorite(restaurantSample);
    const result = await isFavorite(restaurantSample.id);
    expect(result).toBe(true);
  });

  test('Should return false if a restaurant is not in favorites', async () => {
    const result = await isFavorite('2'); // ID yang tidak ada
    expect(result).toBe(false);
  });
});
