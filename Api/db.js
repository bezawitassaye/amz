import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',          // your DB username
  host: 'localhost',         // usually localhost
  database: 'ecommerce',     // your DB name
  password: '1234',          // your DB password
  port: 5433,                // your DB port
});

export default pool;
