type Any<T> = any; // Placeholder for "Any" type

interface Product {
  collection_id: null;
  created_at: Date;
  deleted_at: null;
  description: null;
  discountable: true;
  external_id: null;
  handle: null;
  height: null;
  hs_code: null;
  id: string;
  is_giftcard: false;
  length: null;
  material: null;
  metadata: null;
  mid_code: null;
  origin_country: null;
  profile_id: string;
  status: "draft";
  subtitle: null;
  thumbnail: string;
  title: string;
  type_id: null;
  updated_at: Date;
  weight: null;
  width: null;
}

interface Variant {
  allow_backorder: false;
  barcode: null;
  created_at: Date;
  deleted_at: null;
  ean: null;
  height: null;
  hs_code: null;
  id: string;
  inventory_quantity: 10;
  length: null;
  manage_inventory: true;
  material: null;
  metadata: null;
  mid_code: null;
  origin_country: null;
  product: Product;
  product_id: string;
  sku: null;
  title: string;
  upc: null;
  updated_at: Date;
  weight: null;
  width: null;
}

interface EmailObject {
  emails: string[];
}

interface RestockNotification extends EmailObject {
  product: Product;
  variant: Variant;
  variant_id: string;
}

export default RestockNotification;