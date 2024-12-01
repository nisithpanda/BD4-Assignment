const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();

app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

/***
 * Get All Restaurants
 */
async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let results = await db.all(query, []);

  return { restaurants: results };
}
app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Restaurant Found.' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/***
 * Get Restaurant by id
 */
async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let result = await db.get(query, [id]);

  return { restaurant: result };
}
app.get('/restaurants/details/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let result = await fetchRestaurantById(id);
    if (result.restaurant === null) {
      return res.status(404).json({ message: 'No Resaturant Found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/***
 * Get Restaurants by Cuisine
 */
async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ? COLLATE NOCASE';
  let results = await db.all(query, [cuisine]);

  return { restaurants: results };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    let results = await fetchRestaurantsByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Resaturant Found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/***
 * Get Restaurants by Filter -
 * @isVeg (string)
 * @hasOutdoorSeating (string)
 * @isLuxury (string)
 */
async function filterRestaurantsByVegOutdoorLuxury(
  isVeg,
  hasOutdoorSeating,
  isLuxury
) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let results = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: results };
}
app.get('/restaurants/filter', async (req, res) => {
  try {
    const isVeg = req.query.isVeg;
    const hasOutdoorSeating = req.query.hasOutdoorSeating;
    const isLuxury = req.query.isLuxury;
    let results = await filterRestaurantsByVegOutdoorLuxury(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Resaturant Found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/***
 * Get Restautants Sort By rating
 */

async function sortRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let results = await db.all(query, []);

  return { restaurants: results };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortRestaurantsByRating();
    if (results.restaurants.length === 0) {
      return res.status(404).json({ message: 'No Resaturant Found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/***
 * Get All Dishes
 */
async function fetchAllDishes() {
  let query = 'SELECT * FROM dishes';
  let results = await db.all(query, []);

  return { dishes: results };
}
app.get('/dishes', async (req, res) => {
  try {
    let results = await fetchAllDishes();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/***
 * Get Dish by id
 */
async function fetchDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let result = await db.get(query, [id]);

  return { dish: result };
}
app.get('/dishes/details/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let result = await fetchDishById(id);
    if (results.dish === null) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json(result);
});

/***
 * Get Dishes by filter
 */
async function fetchDishesByFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let results = await db.all(query, [isVeg]);

  return { dishes: results };
}
app.get('/dishes/filter', async (req, res) => {
  try {
    const isVeg = req.query.isVeg;
    let results = await fetchDishesByFilter(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/***
 * Get Dishes SORT by price
 */
async function fetchDishesSortByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let results = await db.all(query, []);

  return { dishes: results };
}
app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await fetchDishesSortByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No Dishes Found.' });
    }
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
