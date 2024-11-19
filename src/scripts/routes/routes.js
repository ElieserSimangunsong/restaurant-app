// import { index } from './index.js';
// import { favorite } from './favorite.js';
// import { restaurantDetail } from './restaurantDetail.js';
import Favorite from '../views/pages/favorite.js';
import Home from '../views/pages/home.js';
import RestaurantDetail from '../views/pages/restaurantDetail.js';

const routes = {
  '/': Home,
  '/favorite': Favorite,
  '/detail/:id': RestaurantDetail,
};

export default routes;
