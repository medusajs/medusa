import { Product } from '../product';
import { Region } from '../region';

export interface ProductVariant {
  id: string;
  title: string;
  product_id: string;
  product: Product;
  prices: MoneyAmount[];
  sku?: string;
  barcase?: string;
  ean?: string;
  upc?: string;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface MoneyAmount {
  id: string;
  currency_code: string;
  currency: Currency;
  amount: number;
  sale_amount?: number;
  variant_id?: string;
  variant?: ProductVariant;
  region_id?: string;
  region: Region;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Currency {
  code: string;
  symbol: string;
  symbol_native: string;
  name: string;
}
