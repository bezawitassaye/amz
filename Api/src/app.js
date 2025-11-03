import express from 'express';
import cors from 'cors';
import { fetchProducts } from './controllers/productController.js';
import userRoutes from "./route/userRoutes.js";

const app = express();
const PORT = 5000;

// Enable CORS for all origins (for development)
app.use(cors());

app.get('/api/products', fetchProducts);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
