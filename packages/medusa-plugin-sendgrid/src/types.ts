import {EmailData} from '@sendgrid/helpers/classes/email-address'

/** @exampledata https://docs.medusajs.com/plugins/notifications/sendgrid */

export interface Template {
  /** The dynamic template id. */
  id: string
  /** The subject of the email. */
  subject?: string
}

export interface Templates {
  /** Template to be sent to the customer when they place a new order. */
  order_placed_template?: Template
  order_canceled_template?: Template
  order_shipment_created_template?: Template
  order_return_requested_template?: Template
  order_items_returned_template?: Template
  claim_shipment_created_template?: Template
  swap_created_template?: Template
  swap_shipment_created_template?: Template
  swap_received_template?: Template
  gift_card_created_template?: Template
  customer_password_reset_template?: Template
  user_password_reset_template?: Template
  medusa_restock_template?: Template
  order_refund_created_template?: Template
  // add any other templates here
  [key: string]: Template | undefined
}

export interface PluginOptions {
  api_key: string
  from: {name?: string, email: string } | string
  templates: Templates;
  /** BCC email address to send to when an order is placed. */
  orderPlacedBcc?: EmailData|EmailData[]
  /** locale as key example de-DE */
  localization: {
    [key: string]: Templates;
  }
}

