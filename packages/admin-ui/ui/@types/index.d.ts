export declare module "@medusajs/medusa/dist/models/store" {
  declare interface Store {
    members?: User[]
    products?: Product[]
    orders?: Order[]
    shipping_profiles?: ShippingProfile[]
  }
}

export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/order" {
  declare interface Order {
    store_id: string
    store?: Store
    order_parent_id: string
    parent?: Order
    children?: Order[]
  }
}

export declare module "@medusajs/medusa/dist/models/shipping-profile" {
  declare interface ShippingProfile {
    store_id?: string
    store?: Store
  }
}

export declare module "@medusajs/medusa/dist/models/payment" {
  declare interface Payment {
    payment_parent_id?: string
  }
}
