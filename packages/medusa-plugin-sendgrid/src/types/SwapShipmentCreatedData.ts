type Any<T> = T;

interface TaxLine {
  code: string;
  created_at: Any<Date>;
  id: Any<string>;
  item_id: Any<string>;
  metadata: null;
  name: string;
  rate: number;
  updated_at: Any<Date>;
}

interface Variant {
  allow_backorder: boolean;
  barcode: null;
  created_at: Any<Date>;
  deleted_at: null;
  ean: null;
  height: null;
  hs_code: null;
  id: string;
  inventory_quantity: number;
  length: null;
  manage_inventory: boolean;
  material: null;
  metadata: null;
  mid_code: null;
  origin_country: null;
  product: {
    collection_id: null;
    created_at: Any<Date>;
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
    metadata: null;
    mid_code: null;
    origin_country: null;
    profile_id: Any<string>;
    status: string;
    subtitle: null;
    thumbnail: null;
    title: string;
    type_id: null;
    updated_at: Any<Date>;
    weight: null;
    width: null;
  };
  product_id: string;
  sku: null;
  title: string;
  upc: null;
  updated_at: Any<Date>;
  weight: null;
  width: null;
}

interface Item {
  allow_discounts: boolean;
  cart_id: Any<string>;
  claim_order_id: null;
  created_at: Any<Date>;
  description: string;
  discounted_price: string;
  fulfilled_quantity: number;
  has_shipping: boolean;
  id: Any<string>;
  is_giftcard: boolean;
  is_return: boolean;
  metadata: null;
  order_id: null;
  price: string;
  quantity: number;
  returned_quantity: null;
  shipped_quantity: number;
  should_merge: boolean;
  swap_id: Any<string>;
  tax_lines: TaxLine[];
  thumbnail: null;
  title: string;
  unit_price: number;
  updated_at: Any<Date>;
  variant: Variant;
  variant_id: string;
}

interface Fulfillment {
  canceled_at: null;
  claim_order_id: null;
  created_at: Any<Date>;
  data: Record<string, unknown>;
  id: Any<string>;
  idempotency_key: null;
  items: Item[];
  metadata: Record<string, unknown>;
  no_notification: null;
  order_id: null;
  provider_id: string;
  shipped_at: Any<Date>;
  swap_id: Any<string>;
  tracking_links: any[];
  tracking_numbers: any[];
  updated_at: Any<Date>;
}

interface Region {
  automatic_taxes: boolean;
  created_at: Any<Date>;
  currency_code: string;
  deleted_at: null;
  fulfillment_providers: any[];
  gift_cards_taxable: boolean;
  id: Any<string>;
  metadata: null;
  name: string;
  payment_providers: Array<{ id: string; is_installed: boolean }>;
  tax_code: null;
  tax_provider_id: null;
  tax_rate: number;
  updated_at: Any<Date>;
}

interface ShippingAddress {
  address_1: string;
  address_2: null;
  city: string;
  company: null;
  country_code: null;
  created_at: Any<Date>;
  customer_id: null;
  deleted_at: null;
  first_name: null;
  id: Any<string>;
  last_name: null;
  metadata: null;
  phone: string;
  postal_code: string;
  province: string;
  updated_at: Any<Date>;
}

interface ShippingMethod {
  cart_id: Any<string>;
  claim_order_id: null;
  data: Record<string, unknown>;
  id: Any<string>;
  order_id: null;
  price: number;
  return_id: null;
  shipping_option: {
    admin_only: boolean;
    amount: number;
    created_at: Any<Date>;
    data: Record<string, unknown>;
    deleted_at: null;
    id: Any<string>;
    is_return: false;
    metadata: null;
    name: string;
    price_type: string;
    profile_id: Any<string>;
    provider_id: string;
    region_id: string;
    updated_at: Any<Date>;
  };
  shipping_option_id: Any<string>;
  swap_id: Any<string>;
  tax_lines: TaxLine[];
}

interface ReturnItem {
  is_requested: boolean;
  item_id: string;
  metadata: null;
  note: null;
  quantity: number;
  reason_id: null;
  received_quantity: null;
  requested_quantity: number;
  return_id: Any<string>;
}

interface ReturnOrder {
  claim_order_id: null;
  created_at: Any<Date>;
  id: Any<string>;
  idempotency_key: null;
  items: ReturnItem[];
  metadata: null;
  no_notification: null;
  order_id: null;
  received_at: null;
  refund_amount: number;
  shipping_data: null;
  status: string;
  swap_id: Any<string>;
  updated_at: Any<Date>;
}

interface Swap {
  additional_items: Item[];
  allow_backorder: true;
  beforeInsert: () => void;
  canceled_at: null;
  cart_id: Any<string>;
  confirmed_at: Any<Date>;
  created_at: Any<Date>;
  deleted_at: null;
  difference_due: number;
  fulfillment_status: string;
  id: Any<string>;
  idempotency_key: Any<string>;
  metadata: null;
  no_notification: null;
  order_id: Any<string>;
  payment_status: string;
  return_order: ReturnOrder;
  shipping_address: ShippingAddress;
  shipping_address_id: Any<string>;
  shipping_methods: ShippingMethod[];
  updated_at: Any<Date>;
}

interface Order {
  beforeInsert: () => void;
  billing_address_id: null;
  canceled_at: null;
  cart_id: null;
  created_at: Any<Date>;
  currency_code: string;
  customer_id: Any<string>;
  discounts: any[];
  display_id: Any<number>;
  draft_order_id: null;
  email: string;
  external_id: null;
  fulfillment_status: string;
  id: Any<string>;
  idempotency_key: null;
  items: Item[];
  metadata: null;
  no_notification: null;
  object: string;
  payment_status: string;
  region: Region;
  region_id: string;
  shipping_address_id: Any<string>;
  status: string;
  swaps: Swap[];
  tax_rate: null;
  updated_at: Any<Date>;
}

interface TrackingLink {
  code: string;
  created_at: Any<Date>;
  id: Any<string>;
  metadata: null;
  name: string;
  rate: number;
  shipping_method_id: Any<string>;
  updated_at: Any<Date>;
}

interface SwapShipmentCreatedData {
  additional_total: string;
  date: Any<string>;
  email: string;
  fulfillment: Fulfillment;
  items: Item[];
  locale: null;
  order: Order;
  paid_total: string;
  refund_amount: string;
  return_total: string;
  swap: Swap;
  tax_amount: string;
  tracking_links: TrackingLink[];
  tracking_number: string;
}

export default SwapShipmentCreatedData;