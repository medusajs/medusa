import { VariantInventory } from "@medusajs/medusa";

interface FulfillmentItem {
  fulfillment_id: string;
  item_id: string;
  quantity: number;
}

interface Fulfillment {
  canceled_at: any;
  claim_order_id: string;
  created_at: any;
  data: Record<string, any>;
  id: string;
  idempotency_key: null;
  items: FulfillmentItem[];
  metadata: Record<string, any>;
  no_notification: null;
  order_id: null;
  provider_id: string;
  shipped_at: any;
  swap_id: null;
  tracking_links: any[];
  tracking_numbers: any[];
  updated_at: any;
}

interface OrderItem {
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
  metadata: null;
  order_id: string;
  quantity: number;
  returned_quantity: null;
  shipped_quantity: number | null;
  should_merge: true;
  swap_id: null;
  thumbnail: string;
  title: string;
  unit_price: number;
  updated_at: any;
  variant: VariantInventory;
  variant_id: string;
}

export interface OrderShippingAddress {
  address_1: string;
  address_2: null;
  city: null;
  company: null;
  country_code: string;
  created_at: any;
  customer_id: null;
  deleted_at: null;
  first_name: string;
  id: string;
  last_name: string;
  metadata: null;
  phone: null;
  postal_code: string;
  province: null;
  updated_at: any;
}

interface ClaimOrder {
  canceled_at: null;
  created_at: any;
  deleted_at: null;
  fulfillment_status: string;
  id: string;
  idempotency_key: string;
  metadata: null;
  no_notification: null;
  order: {
    billing_address_id: null;
    canceled_at: null;
    cart_id: null;
    created_at: any;
    currency_code: string;
    customer_id: string;
    display_id: number;
    draft_order_id: null;
    email: string;
    external_id: null;
    fulfillment_status: string;
    id: string;
    idempotency_key: null;
    items: OrderItem[];
    metadata: null;
    no_notification: null;
    object: string;
    payment_status: string;
    region_id: string;
    shipping_address: OrderShippingAddress;
    shipping_address_id: string;
    status: string;
    tax_rate: null;
    updated_at: any;
  };
  order_id: string;
  payment_status: string;
  refund_amount: null;
  shipping_address_id: string;
  type: string;
  updated_at: any;
}

interface ClaimShipmentData {
  claim: ClaimOrder;
  email: string;
  fulfillment: Fulfillment;
  locale: null;
  order: {
    billing_address_id: null;
    canceled_at: null;
    cart_id: null;
    created_at: any;
    currency_code: string;
    customer_id: string;
    display_id: number;
    draft_order_id: null;
    email: string;
    external_id: null;
    fulfillment_status: string;
    id: string;
    idempotency_key: null;
    items: OrderItem[];
    metadata: null;
    no_notification: null;
    object: string;
    payment_status: string;
    region_id: string;
    shipping_address: OrderShippingAddress;
    shipping_address_id: string;
    status: string;
    tax_rate: null;
    updated_at: any;
  };
  tracking_links: any[];
  tracking_number: string;
}

export default ClaimShipmentData;
