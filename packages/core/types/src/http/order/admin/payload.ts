export interface AdminCreateOrderFulfillment {
  items: { id: string; quantity: number }[]
  location_id?: string
  no_notification?: boolean
  metadata?: Record<string, any>
}

export interface AdminCreateOrderShipment {
  items: { id: string; quantity: number }[]
  labels?: {
    tracking_number: string
    tracking_url: string
    label_url: string
  }[]
  no_notification?: boolean
  metadata?: Record<string, any>
}

export interface AdminCancelOrderFulfillment {
  no_notification?: boolean
}

export interface AdminMarkOrderFulfillmentAsDelivered {}
