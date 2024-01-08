interface TaxLine {
  code: string;
  created_at: any;
  id: any;
  item_id: string;
  metadata: any | null;
  name: string;
  rate: number;
  updated_at: any;
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

interface Variant {
  allow_backorder: boolean;
  barcode: null;
  created_at: any;
  deleted_at: null;
  ean: null;
  height: null;
  hs_code: null;
  id: string;
  inventory_quantity: number;
  length: null;
  manage_inventory: boolean;
  material: null;
  metadata: any | null;
  mid_code: null;
  origin_country: null;
  product: Product;
  product_id: string;
  sku: null;
  title: string;
  upc: null;
  updated_at: any;
  weight: null;
  width: null;
}

interface Product {
  collection_id: null;
  created_at: any;
  deleted_at: null;
  description: null;
  discountable: boolean;
  external_id: null;
  handle: null;
  height: null;
  hs_code: null;
  id: string;
  is_giftcard: boolean;
  length: null;
  material: null;
  metadata: any | null;
  mid_code: null;
  origin_country: null;
  profile_id: string;
  status: string;
  subtitle: null;
  thumbnail: null;
  title: string;
  type_id: null;
  updated_at: any;
  weight: null;
  width: null;
}

interface Item {
  allow_discounts: boolean;
  cart_id: null;
  claim_order_id: null;
  created_at: any;
  description: string;
  fulfilled_quantity: number | null;
  has_shipping: null;
  id: string;
  is_giftcard: boolean;
  is_return: boolean;
  metadata: any | null;
  order_id: string;
  price: string;
  quantity: number;
  returned_quantity: number | null;
  shipped_quantity: number | null;
  should_merge: boolean;
  swap_id: null;
  tax_lines: TaxLine[];
  thumbnail: null;
  title: string;
  totals: Totals;
  unit_price: number;
  updated_at: any;
  variant: Variant;
  variant_id: string;
}

interface ShippingAddress {
  address_1: string;
  address_2: string | null;
  city: string | null;
  company: string | null;
  country_code: string;
  created_at: any;
  customer_id: null;
  deleted_at: null;
  first_name: string;
  id: any;
  last_name: string;
  metadata: any | null;
  phone: string | null;
  postal_code: string;
  province: string | null;
  updated_at: any;
}

interface ReturnItem {
  is_requested: true;
  item: Item;
  item_id: string;
  metadata: any | null;
  note: null;
  quantity: number;
  reason_id: null;
  received_quantity: null;
  requested_quantity: number;
  return_id: string;
}

interface ReturnRequest {
  claim_order_id: null;
  created_at: any;
  id: string;
  idempotency_key: string;
  items: ReturnItem[];
  metadata: any | null;
  no_notification: null;
  order_id: string;
  received_at: any;
  refund_amount: string;
  shipping_data: null;
  shipping_method: null;
  status: string;
  swap_id: null;
  updated_at: any;
}

interface OrderItemsReturnedData {
  date: string;
  email: string;
  has_shipping: boolean;
  items: Item[];
  locale: null;
  order: {
    beforeInsert: Function;
    billing_address_id: null;
    canceled_at: null;
    cart_id: null;
    claims: any[];
    created_at: any;
    currency_code: string;
    customer_id: string;
    discounts: any[];
    display_id: number;
    draft_order_id: null;
    email: string;
    external_id: null;
    fulfillment_status: string;
    gift_card_transactions: any[];
    gift_cards: any[];
    id: string;
    idempotency_key: null;
    items: Item[];
    metadata: any | null;
    no_notification: null;
    object: string;
    payment_status: string;
    refunds: any[];
    region: any;
    region_id: string;
    returns: ReturnRequest[];
    shipping_address: ShippingAddress;
    shipping_address_id: string;
    shipping_methods: any[];
    shipping_total: string;
    status: string;
    swaps: any[];
    tax_rate: number | null;
    total: number;
    updated_at: any;
  };
  refund_amount: string;
  return_request: ReturnRequest;
  shipping_total: string;
  subtotal: string;
}

export default OrderItemsReturnedData;
