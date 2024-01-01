interface PaymentProvider {
  id: string;
  is_installed: boolean;
}

interface Region {
  automatic_taxes: boolean;
  created_at: any;
  currency_code: string;
  deleted_at: any | null;
  fulfillment_providers: any[];
  gift_cards_taxable: boolean;
  id: string;
  metadata: any | null;
  name: string;
  payment_providers: PaymentProvider[];
  tax_code: string | null;
  tax_provider_id: string | null;
  tax_rate: number;
  updated_at: any;
}

interface ShippingOption {
  admin_only: boolean;
  amount: number;
  created_at: any;
  data: any;
  deleted_at: any | null;
  id: any;
  is_return: boolean;
  metadata: any;
  name: string;
  price_type: string;
  profile_id: any;
  provider_id: string;
  region_id: string;
  updated_at: any;
}

interface ShippingMethod {
  cart_id: null;
  claim_order_id: null;
  data: any;
  id: any;
  order_id: any;
  price: number;
  return_id: null;
  shipping_option: ShippingOption;
  shipping_option_id: any;
  swap_id: null;
  tax_lines: any[];
}

interface ShippingAddress {
  address_1: string;
  address_2: string | null;
  city: string | null;
  company: string | null;
  country_code: string;
  created_at: any;
  customer_id: null;
  deleted_at: any | null;
  first_name: string;
  id: any;
  last_name: string;
  metadata: any | null;
  phone: string | null;
  postal_code: string;
  province: string | null;
  updated_at: any;
}

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

interface Variant {
  allow_backorder: boolean;
  barcode: null;
  created_at: any;
  deleted_at: any | null;
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
  deleted_at: any | null;
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
  thumbnail: string | null;
  title: string;
  unit_price: number;
  updated_at: any;
  variant: Variant;
  variant_id: string;
}

interface Fulfillment {
  canceled_at: any | null;
  claim_order_id: null;
  created_at: any;
  data: any;
  id: string;
  idempotency_key: null;
  items: Item[];
  metadata: any;
  no_notification: null;
  order_id: string;
  provider_id: string;
  shipped_at: any;
  swap_id: null;
  tracking_links: any[];
  tracking_numbers: any[];
  updated_at: any;
}

interface OrderShippedData {
  beforeInsert: Function;
  billing_address: null;
  billing_address_id: null;
  canceled_at: any | null;
  cart_id: null;
  claims: any[];
  created_at: any;
  currency_code: string;
  customer: {
    billing_address_id: null;
    created_at: any;
    deleted_at: null;
    email: string;
    first_name: null;
    has_account: boolean;
    id: string;
    last_name: null;
    metadata: any | null;
    phone: string | null;
    updated_at: any;
  };
  customer_id: string;
  date: any;
  discount_total: number;
  discounts: any[];
  display_id: number;
  draft_order_id: null;
  email: string;
  external_id: null;
  fulfillment_status: string;
  fulfillments: Fulfillment[];
  gift_card_total: number;
  gift_card_transactions: any[];
  gift_cards: any[];
  has_discounts: number;
  has_gift_cards: number;
  id: string;
  idempotency_key: null;
  items: Item[];
  locale: null;
  metadata: any | null;
  no_notification: null;
  object: string;
  payment_status: string;
  payments: any[];
  refundable_amount: number;
  refunded_total: number;
  refunds: any[];
  region: Region;
  region_id: string;
  returns: any[];
  shipping_address: ShippingAddress;
  shipping_address_id: string;
  shipping_methods: ShippingMethod[];
  shipping_total: number;
  status: string;
  subtotal: number;
  swaps: any[];
  tax_rate: number | null;
  tax_total: number;
  total: number;
  updated_at: any;
}

export default OrderShippedData;
