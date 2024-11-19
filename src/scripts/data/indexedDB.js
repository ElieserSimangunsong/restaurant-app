import { openDB } from 'idb';

const DATABASE_NAME = 'restaurant-favorites';
const STORE_NAME = 'favorites';

async function getDatabase(storeName = STORE_NAME) {
  return await openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    },
  });
}

export async function addFavorite(restaurant) {
  if (!restaurant || !restaurant.id) {
    throw new Error('Invalid restaurant data');
  }
  try {
    const db = await getDatabase();
    await db.put(STORE_NAME, restaurant);
    console.log('Added to favorites:', restaurant);
  } catch (error) {
    console.error('Failed to add favorite:', error);
  }
}

export async function removeFavorite(id) {
  if (!id) {
    throw new Error('Invalid ID');
  }
  try {
    const db = await getDatabase();
    await db.delete(STORE_NAME, id);
    console.log('Removed from favorites:', id);
  } catch (error) {
    console.error('Failed to remove favorite:', error);
  }
}

export async function getFavorites() {
  try {
    const db = await getDatabase();
    const favorites = await db.getAll(STORE_NAME);
    console.log('Favorites:', favorites);
    return favorites;
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return [];
  }
}

export async function isFavorite(id) {
  if (!id) {
    throw new Error('Invalid ID');
  }
  try {
    const db = await getDatabase();
    const result = !!(await db.get(STORE_NAME, id));
    console.log(`Is favorite (${id}):`, result);
    return result;
  } catch (error) {
    console.error('Failed to check favorite:', error);
    return false;
  }
}

export async function clearFavorites() {
  try {
    const db = await getDatabase();
    await db.clear(STORE_NAME);
    console.log('Cleared all favorites');
  } catch (error) {
    console.error('Failed to clear favorites:', error);
  }
}
