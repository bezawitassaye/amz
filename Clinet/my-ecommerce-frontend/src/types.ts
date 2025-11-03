// src/types.ts
export interface Product {
  asin: string;
  title: string;
  price: string;
  original_price?: string;
  currency?: string;
  rating?: number;
  num_ratings?: number;
  url: string;
  photo: string;
  sales_volume?: string;
  is_best_seller?: boolean;
  is_amazon_choice?: boolean;
  is_prime?: boolean;
  climate_pledge_friendly?: boolean;
  has_variations?: boolean;
  product_badge?: string;
  delivery_info?: string;
}
