type Any<T> = any; // Placeholder for "Any" type

interface PaymentProvider {
  id: string;
  is_installed: boolean;
}

interface Region {
  automatic_taxes: boolean;
  created_at: Date;
  currency_code: string;
  deleted_at: Date | null;
  fulfillment_providers: any[];
  gift_cards_taxable: boolean;
  id: string;
  metadata: any | null;
  name: string;
  payment_providers: PaymentProvider[];
  tax_code: any | null;
  tax_provider_id: any | null;
  tax_rate: number;
  updated_at: Date;
}

interface Variant {
  allow_backorder: boolean;
  barcode: string | null;
  created_at: Date;
  deleted_at: Date | null;
  ean: string | null;
  height: number | null;
  hs_code: string | null;
  id: string;
  inventory_quantity: number;
  length: number | null;
  manage_inventory: boolean;
  material: string | null;
  metadata: any | null;
  mid_code: string | null;
  origin_country: string | null;
  product: Product;
  product_id: string;
  sku: string | null;
  title: string;
  upc: string | null;
  updated_at: Date;
  weight: number | null;
  width: number | null;
}

interface Product {
  collection_id: string | null;
  created_at: Date;
  deleted_at: Date | null;
  description: string | null;
  discountable: boolean;
  external_id: string | null;
  handle: string | null;
  height: number | null;
  hs_code: string | null;
  id: string;
  is_giftcard: boolean;
  length: number | null;
  material: string | null;
  metadata: any | null;
  mid_code: string | null;
  origin_country: string | null;
  profile_id: string;
  status: string;
  subtitle: string | null;
  thumbnail: string | null;
  title: string;
  type_id: string | null;
  updated_at: Date;
  weight: number | null;
  width: number | null;
}

interface Item {
  allow_discounts: boolean;
  cart_id: string | null;
  claim_order_id: string | null;
  created_at: Date;
  description: string;
  fulfilled_quantity: number;
  has_shipping: boolean | null;
  id: string;
  is_giftcard: boolean;
  is_return: boolean;
  metadata: any | null;
  order_id: string | null;
  quantity: number;
  returned_quantity: number | null;
  shipped_quantity: number;
  should_merge: boolean;
  swap_id: string | null;
  thumbnail: string | null;
  title: string;
  unit_price: number;
  updated_at: Date;
  variant: Variant;
  variant_id: string;
}

interface ShippingAddress {
  address_1: string;
  address_2: string | null;
  city: string | null;
  company: string | null;
  country_code: string;
  created_at: Date;
  customer_id: string | null;
  deleted_at: Date | null;
  first_name: string;
  id: string;
  last_name: string;
  metadata: any | null;
  phone: string | null;
  postal_code: string;
  province: string | null;
  updated_at: Date;
}

interface Order {
  billing_address_id: string | null;
  canceled_at: Date | null;
  cart_id: string | null;
  created_at: Date;
  currency_code: string;
  customer_id: string;
  display_id: number;
  draft_order_id: string | null;
  email: string;
  external_id: string | null;
  fulfillment_status: string;
  id: string;
  idempotency_key: string | null;
  items: Item[];
  metadata: any | null;
  no_notification: any | null;
  object: string;
  payment_status: string;
  region_id: string;
  shipping_address: ShippingAddress;
  shipping_address_id: string;
  status: string;
  tax_rate: any | null;
  updated_at: Date;
}

interface GiftCardCreatedData {
  code: Any<string>;
  value: number;
  balance: number;
  display_value: string;
  region: Region;
  region_id: string;
  order: Order;
  order_id: string;
  is_disabled: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  locale: null;
  email: string;
}

export default GiftCardCreatedData;