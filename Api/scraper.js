import axios from 'axios';
import { Pool } from 'pg';

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: '1234',
  port: 5433, // your port
});

// Helper to convert price strings like "$199.99" to numbers
function parsePrice(priceStr) {
  if (!priceStr) return null;
  return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
}

const options = {
  method: 'GET',
  url: 'https://real-time-amazon-data.p.rapidapi.com/search',
  params: {
    query: 'smartwatch',
    page: '1',
    country: 'US',
    sort_by: 'RELEVANCE',
    product_condition: 'ALL',
    is_prime: 'false',
    deals_and_discounts: 'NONE'
  },
  headers: {
    'x-rapidapi-key': 'cc8f2ab261msh1eb5b4e18a9f0eap16ecb2jsn55494e8c289d',
    'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
  }
};

async function fetchAndSave() {
  try {
    const response = await axios.request(options);
    const products = response.data.data.products; // correct path

    if (!products || products.length === 0) {
      return console.log("No products found");
    }

    const query = `
      INSERT INTO products
      (asin, title, price, original_price, currency, rating, num_ratings, url, photo, sales_volume,
       is_best_seller, is_amazon_choice, is_prime, climate_pledge_friendly, has_variations, product_badge, delivery_info)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      ON CONFLICT (asin) DO NOTHING
    `;

    for (let p of products) {
      await pool.query(query, [
        p.asin,
        p.product_title,
        parsePrice(p.product_price),            // parse price
        parsePrice(p.product_original_price),   // parse original price
        p.currency,
        p.product_star_rating ? parseFloat(p.product_star_rating) : null,
        p.product_num_ratings ? parseInt(p.product_num_ratings) : null,
        p.product_url,
        p.product_photo,
        p.sales_volume,
        p.is_best_seller || false,
        p.is_amazon_choice || false,
        p.is_prime || false,
        p.climate_pledge_friendly || false,
        p.has_variations || false,
        p.product_badge || null,
        p.delivery || null
      ]);
    }

    console.log(`Saved ${products.length} products to database.`);
  } catch (error) {
    console.error('Error fetching or saving products:', error.message);
  } finally {
    await pool.end();
  }
}

fetchAndSave();
