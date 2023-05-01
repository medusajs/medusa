import type {
  Customer,
  CustomerGroup,
  Order,
  PriceList,
  Product,
  ProductCategory,
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

export interface ProductCategoryWidgetProps extends WidgetProps {
  productCategory: ProductCategory
}

export interface CustomerWidgetProps extends WidgetProps {
  customer: Customer
}

export interface CustomerGroupWidgetProps extends WidgetProps {
  customerGroup: CustomerGroup
}

export interface PriceListWidgetProps extends WidgetProps {
  priceList: PriceList
}

export type { WidgetProps }
