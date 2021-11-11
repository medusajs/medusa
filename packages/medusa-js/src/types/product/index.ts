import { ProductVariant } from '../product-variant';

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  handle?: string;
  is_giftcard: boolean;
  images: Image[];
  thumbnail?: string;
  options: ProductOption[];
  variants: ProductVariant[];
  profile_id: string;
  weight?: number;
  length?: number;
  height?: number;
  width?: number;
  hs_code?: string;
  origin_country?: string;
  mid_code?: string;
  material?: string;
  collection_id?: string;
  collection?: ProductCollection;
  type_id?: string;
  type?: ProductType;
  tags?: ProductTag[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface Image {
  id: string;
  url: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface ProductOption {
  id: string;
  title: string;
  values: ProductOptionValue[];
  product_id: string;
  product: Product;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface ProductOptionValue {
  id: string;
  value: string;
  option_id: string;
  option: ProductOption;
  variant_id: string;
  variant: ProductVariant;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface ProductCollection {
  id: string;
  title: string;
  handle?: string;
  products: Product[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface ProductType {
  id: string;
  value: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface ProductTag {
  id: string;
  value: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface ProductListPayload {
  limit?: number;
  offset?: number;
}
