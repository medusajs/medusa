type Any<T> = any; // Placeholder for "Any" type

interface TaxLine {
  code: string;
  created_at: Date;
  id: string;
  item_id: string;
  metadata: any | null;
  name: string;
  rate: number;
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
  tax_lines: TaxLine[];
  thumbnail: string | null;
  title: string;
  unit_price: number;
  updated_at: Date;
  variant: Variant;
  variant_id: string;
}

interface ReturnItem extends Item {}

interface Swap {
  additional_items: Item[];
  return_order: {
    claim_order_id: string | null;
    created_at: Date;
    id: string;
    idempotency_key: string | null;
    items: ReturnItem[];
    metadata: any | null;
    no_notification: any | null;
    order_id: string | null;
    received_at: Date | null;
    refund_amount: string;
    shipping_data: any | null;
    status: string;
    swap_id: string | null;
    updated_at: Date;
  };
  allow_backorder: boolean;
  canceled_at: Date | null;
  cart_id: string;
  confirmed_at: Date;
  created_at: Date;
  deleted_at: Date | null;
  difference_due: number;
  fulfillment_status: string;
  id: string;
  idempotency_key: string;
  metadata: any | null;
  no_notification: any | null;
  order_id: string;
  payment_status: string;
  shipping_address_id: string;
  updated_at: Date;
}

interface Order {
  discounts: any[];
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
  shipping_address: {
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
  };
  shipping_address_id: string;
  status: string;
  tax_rate: any | null;
  updated_at: Date;
  swaps: Swap[];
}

interface ReturnRequest {
  claim_order_id: string | null;
  created_at: Date;
  id: string;
  idempotency_key: string;
  items: ReturnItem[];
  metadata: any | null;
  no_notification: any | null;
  order_id: string;
  received_at: Date;
  refund_amount: string;
  shipping_data: any | null;
  shipping_method: string | null;
  status: string;
  swap_id: string | null;
  updated_at: Date;
}

interface Totals {
  discount_total: number;
  gift_card_total: number;
  original_tax_total: number;
  original_total: number;
  quantity: number;
  subtotal: number;
  tax_lines: TaxLine[];
  tax_total: number;
  total: number;
  unit_price: number;
}

interface ReturnTotal {
  return_items: ReturnItem[];
  return_total: string;
}

interface Summary {
  tax_total: string;
  refund_amount: string;
  additional_total: string;
}

interface SwapReceivedData {
  locale: null;
  swap: Swap;
  order: Order;
  return_request: ReturnRequest;
  date: string;
  swapLink: string;
  email: string;
  items: Item[];
  return_items: ReturnItem[];
  return_total: string;
  tax_total: string;
  refund_amount: string;
  additional_total: string;
}


export default SwapReceivedData;