export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL' | 'Free Size';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  sku: string;
  color: string;
  size: ProductSize;
  stock: number;
}

export type MainCategory = 'men' | 'women' | 'kids';

export type SubCategory =
  | 'Shirts'
  | 'T-shirts'
  | 'Trousers'
  | 'Jeans'
  | 'Ethnic Wear'
  | 'Kurtis'
  | 'Sarees'
  | 'Dresses'
  | 'Kids Wear';

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: MainCategory;
  subcategory: SubCategory;
  price: number;
  originalPrice: number;
  discountPercent: number;
  description: string;
  fabric: string;
  fit: string;
  pattern: string;
  careInstructions: string;
  origin: string;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  variants: ProductVariant[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
}
