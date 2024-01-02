import { LineItem, Notification } from "@medusajs/medusa"
import { LineItemTotals } from "@medusajs/medusa/dist/services/totals"

/** @exampledata https://docs.medusajs.com/plugins/notifications/sendgrid */
interface Templates {
  /** Template to be sent to the customer when they place a new order. */
  order_placed_template?: string
  order_canceled_template?: string
  order_shipped_template?: string
  order_return_requested_template?: string
  order_items_returned_template?: string
  claim_shipment_created_template?: string
  swap_created_template?: string
  swap_shipment_created_template?: string
  swap_received_template?: string
  gift_card_created_template?: string
  customer_password_reset_template?: string
  user_password_reset_template?: string
  medusa_restock_template?: string
  order_refund_created_template?: string
}

export interface PluginOptions {
  api_key: string
  from: string
  templates: Templates;
  /** locale as key example de-DE */
  localization: {
    [key: string]: Templates;
  }
}

export interface AttachmentsArray {
  name: string
  base64: string
  type: string
  content?: string
  filename?: string
}
export interface FromFullFilementService {
  name: string
  base_64: string
  type: string
}

export interface EventData {
  id: string
  return_id?: string
  refund_id?: string
  fulfillment_id?: string
  variant_id?: string
  emails?: string[]
}

export class SendGridData extends Notification {
  data: {
    template_id: string
    from: string
    to: string
    dynamic_template_data?: Record<any, any>
    has_attachments?: boolean
  }
}

export type NewLineItem = Omit<LineItem, "beforeUpdate" | "afterUpdateOrLoad"> & {
  totals: LineItemTotals
  thumbnail: string
  discounted_price: string
  price: string
}