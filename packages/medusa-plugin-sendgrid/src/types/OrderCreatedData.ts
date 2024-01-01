type Any<T> = T; // Define Any type

interface TaxLine {
  code: string;
  created_at: Any<Date>;
  id: Any<string>;
  item_id: string;
  metadata: any | null;
  name: string;
  rate: number;
  updated_at: Any<Date>;
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
  barcode: string | null;
  created_at: Any<Date>;
  deleted_at: Any<Date> | null;
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
  updated_at: Any<Date>;
  weight: number | null;
  width: number | null;
}

interface Product {
  collection_id: string | null;
  created_at: Any<Date>;
  deleted_at: Any<Date> | null;
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
  updated_at: Any<Date>;
  weight: number | null;
  width: number | null;
}

interface Item {
  allow_discounts: boolean;
  cart_id: string | null;
  claim_order_id: string | null;
  created_at: Any<Date>;
  description: string;
  discounted_price: string;
  fulfilled_quantity: number;
  has_shipping: boolean | null;
  id: string;
  is_giftcard: boolean;
  is_return: boolean;
  metadata: any | null;
  order_id: string;
  price: string;
  quantity: number;
  returned_quantity: number | null;
  shipped_quantity: number;
  should_merge: boolean;
  swap_id: string | null;
  tax_lines: TaxLine[];
  thumbnail: string | null;
  title: string;
  totals: Totals;
  unit_price: number;
  updated_at: Any<Date>;
  variant: Variant;
  variant_id: string;
}

interface Region {
  automatic_taxes: boolean;
  created_at: Any<Date>;
  currency_code: string;
  deleted_at: Any<Date> | null;
  fulfillment_providers: any[];
  gift_cards_taxable: boolean;
  id: string;
  metadata: any | null;
  name: string;
  payment_providers: PaymentProvider[];
  tax_code: string | null;
  tax_provider_id: string | null;
  tax_rate: number;
  updated_at: Any<Date>;
}

interface PaymentProvider {
  id: string;
  is_installed: boolean;
}

interface ShippingAddress {
  address_1: string;
  address_2: string | null;
  city: string | null;
  company: string | null;
  country_code: string;
  created_at: Any<Date>;
  customer_id: string | null;
  deleted_at: Any<Date> | null;
  first_name: string;
  id: Any<string>;
  last_name: string;
  metadata: any | null;
  phone: string | null;
  postal_code: string;
  province: string | null;
  updated_at: Any<Date>;
}

interface Customer {
  billing_address_id: string | null;
  created_at: Any<Date>;
  deleted_at: Any<Date> | null;
  email: string;
  first_name: string | null;
  has_account: boolean;
  id: Any<string>;
  last_name: string | null;
  metadata: any | null;
  phone: string | null;
  updated_at: Any<Date>;
}

interface OrderCreatedData {
  beforeInsert: Function;
  billing_address: null;
  billing_address_id: string | null;
  canceled_at: Any<Date> | null;
  cart_id: string | null;
  claims: any[];
  created_at: Any<Date>;
  currency_code: string;
  customer: Customer;
  customer_id: Any<string>;
  date: Any<string>;
  discount_total: string;
  discounts: any[];
  display_id: Any<number>;
  draft_order_id: string | null;
  email: string;
  external_id: string | null;
  fulfillment_status: string;
  fulfillments: any[];
  gift_card_total: string;
  gift_card_transactions: any[];
  gift_cards: any[];
  has_discounts: number;
  has_gift_cards: number;
  id: Any<string>;
  idempotency_key: string | null;
  items: Item[];
  locale: string | null;
  metadata: any | null;
  no_notification: any | null;
  object: string;
  payment_status: string;
  payments: any[];
  refunded_total: number;
  refunds: any[];
  region: Region;
  region_id: string;
  returns: any[];
  shipping_address: ShippingAddress;
  shipping_address_id: Any<string>;
  shipping_methods: any[];
  shipping_total: string;
  status: string;
  subtotal: string;
  subtotal_ex_tax: string;
  swaps: any[];
  tax_rate: number | null;
  tax_total: string;
  total: string;
  updated_at: Any<Date>;
}

export default OrderCreatedData;
