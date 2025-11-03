import { useEffect, useState } from 'react';
import type { Product } from '../types';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🛍️ All Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(p => (
            <div
              key={p.asin}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer"
            >
              <img
                src={p.photo}
                alt={p.title}
                 className="w-full h-60 object-contain rounded-t-xl "
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg text-gray-800 line-clamp-2">
                  {p.title}
                </h2>
                <p className="text-blue-600 font-bold mt-2">{p.price}</p>
                <p className="text-gray-500 text-sm mt-1">
                  ⭐ Rating: {p.rating || 'N/A'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
