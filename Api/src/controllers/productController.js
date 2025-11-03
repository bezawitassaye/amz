import { getProducts } from '../repositories/productRepository.js';

export async function fetchProducts(req, res) {
  try {
    const products = await getProducts(); // no category
    res.json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
}
