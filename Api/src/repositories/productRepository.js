import pool from '../config/db.js';

export async function getProducts() {
  // Always fetch all products, ordered by creation date
  const query = 'SELECT * FROM products ';
  const { rows } = await pool.query(query);
  //console.log(rows)
  return rows;
}
