import { LineItem } from '../line-item';
import { Order } from '../order';
import { ReturnReason } from '../return-reason';
import { ShippingMethod } from '../shipping-method';
import { Swap } from '../swap';

export interface Return {
  id: string;
  status: ReturnStatus;
  items: ReturnItem[];
  swap_id?: string;
  swap: Swap;
  order_id?: string;
  order: Order;
  shipping_method: ShippingMethod;
  shipping_data?: JSON;
  refund_amount: number;
  received_at?: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  metadata?: JSON;
}

export interface ReturnItem {
  item_id: string;
  item: LineItem;
  return_id: string;
  return_order: Return;
  quantity: number;
  is_requested: boolean;
  reason_id?: string;
  reason?: ReturnReason;
  note?: string;
  requested_quantity?: number;
  received_quantity?: number;
  metadata?: JSON;
}

export enum ReturnStatus {
  REQUESTED = 'requested',
  RECEIVED = 'received',
  REQUIRES_ACTION = ' requires_action',
}

export interface ReturnCreateResource {
  order_id: string;
  items: {
    item_id: string;
    quantity: string;
    reason_id?: string;
    note?: string;
  };
  return_shipping?: {
    option_id: string;
  };
}
