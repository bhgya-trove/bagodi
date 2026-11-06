import { ProductColor, ProductSize } from './product';

export interface CartItem {
  id: string; // unique item id: productId-color-size
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
  sku: string;
  maxStock: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
}

