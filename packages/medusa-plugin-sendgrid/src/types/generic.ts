import { LineItem, Notification } from "@medusajs/medusa"

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
  event_name: string
  to: string
  data: {
    template_id: string
    from: string
    to: string
    dynamic_template_data?: Record<any, any>
    has_attachments?: boolean
  }
}

export type NewLineItem = Omit<LineItem, "beforeUpdate" | "afterUpdateOrLoad"> & {
  totals: any
  thumbnail: string
  discounted_price: string
  price: string
}