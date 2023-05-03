import type {
  Customer,
  Order,
  Product,
  ProductCollection,
} from "@medusajs/medusa"
import type { WidgetProps } from "@medusajs/types"

export interface OrderWidgetProps extends WidgetProps {
  order: Order
}

export interface ProductWidgetProps extends WidgetProps {
  product: Product
}

export interface ProductCollectionWidgetProps extends WidgetProps {
  productCollection: ProductCollection
}

export interface CustomerWidgetProps extends WidgetProps {
  customer: Customer
}

export type { WidgetProps }
