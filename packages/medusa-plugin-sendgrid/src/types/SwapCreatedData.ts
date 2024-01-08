import { VariantInventory } from "@medusajs/medusa";
import { OrderShippingAddress } from "./ClaimShipmentData";

interface TaxLine {
  code: string;
  created_at: any;
  id: string;
  item_id: string;
  metadata: null;
  name: string;
  rate: number;
  updated_at: any;
}

interface AdditionalItem {
  allow_discounts: boolean;
  cart_id: string | null;
  claim_order_id: null;
  created_at: any;
  description: string;
  fulfilled_quantity: number;
  has_shipping: boolean | null;
  id: string;
  is_giftcard: boolean;
  is_return: boolean;
  metadata: Record<string, any>;
  order_id: null;
  quantity: number;
  returned_quantity: null;
  shipped_quantity: number;
  should_merge: true;
  swap_id: string | null;
  tax_lines: TaxLine[];
  thumbnail: string | null;
  title: string;
  unit_price: number;
  updated_at: any;
  variant: VariantInventory;
  variant_id: string;
}

interface ReturnItem {
  allow_discounts: boolean;
  cart_id: string | null;
  claim_order_id: null;
  created_at: any;
  description: string;
  discounted_price: string;
  fulfilled_quantity: number;
  has_shipping: boolean | null;
  id: string;
  is_giftcard: boolean;
  is_return: boolean;
  metadata: null;
  order_id: string | null;
  price: string;
  quantity: number;
  returned_quantity: null;
  shipped_quantity: number;
  should_merge: true;
  swap_id: string | null;
  tax_lines: TaxLine[];
  thumbnail: string | null;
  title: string;
  totals: {
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
  };
  unit_price: number;
  updated_at: any;
  variant: VariantInventory;
  variant_id: string;
}

interface ReturnRequestItem {
  is_requested: true;
  item: ReturnItem;
  item_id: string;
  metadata: null;
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
  items: ReturnRequestItem[];
  metadata: null;
  no_notification: null;
  order_id: string | null;
  received_at: any;
  refund_amount: string;
  shipping_data: null;
  shipping_method: null;
  status: string;
  swap_id: string | null;
  updated_at: any;
}

interface Swap {
  additional_items: AdditionalItem[];
  return_order: {
    claim_order_id: null;
    created_at: any;
    id: string;
    idempotency_key: null;
    items: ReturnRequestItem[];
    metadata: null;
    no_notification: null;
    order_id: null;
    received_at: null;
    refund_amount: number;
    shipping_data: null;
    status: string;
    swap_id: string | null;
    updated_at: any;
  };
  allow_backorder: true;
  canceled_at: null;
  cart_id: string;
  confirmed_at: any;
  created_at: any;
  deleted_at: null;
  difference_due: number;
  fulfillment_status: string;
  id: string;
  idempotency_key: string;
  metadata: null;
  no_notification: null;
  order_id: string;
  payment_status: string;
  shipping_address_id: string;
  updated_at: any;
  swaps: any[];
}

interface ReturnTotal {
  total: string;
}

interface SwapCreatedData {
  locale: null;
  swap: Swap;
  order: {
    discounts: any[];
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
    items: ReturnItem[];
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
    swaps: any[];
  };
  return_request: ReturnRequest;
  date: string;
  swapLink: string;
  email: string;
  items: ReturnItem[];
  return_items: ReturnItem[];
  return_total: ReturnTotal;
  refund_amount: string;
  additional_total: string;
}

export default SwapCreatedData;
