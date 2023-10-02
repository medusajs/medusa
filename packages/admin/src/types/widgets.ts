import type {
  Customer,
  CustomerGroup,
  Discount,
  DraftOrder,
  GiftCard,
  Order,
  PriceList,
  Product,
  ProductCollection,
} from "@medusajs/medusa"

import type { WidgetConfig, WidgetProps } from "@medusajs/admin-ui"

export interface ProductDetailsWidgetProps extends WidgetProps {
  product: Product
}

export interface ProductCollectionDetailsWidgetProps extends WidgetProps {
  productCollection: ProductCollection
}

export interface OrderDetailsWidgetProps extends WidgetProps {
  order: Order
}

export interface DraftOrderDetailsWidgetProps extends WidgetProps {
  draftOrder: DraftOrder
}

export interface DiscountDetailsWidgetProps extends WidgetProps {
  discount: Discount
}

export interface PriceListDetailsWidgetProps extends WidgetProps {
  priceList: PriceList
}

export interface GiftCardDetailsWidgetProps extends WidgetProps {
  giftCard: Product
}

export interface CustomGiftCardWidgetProps extends WidgetProps {
  giftCard: GiftCard
}

export interface CustomerDetailsWidgetProps extends WidgetProps {
  customer: Customer
}

export interface CustomerGroupDetailsWidgetProps extends WidgetProps {
  customerGroup: CustomerGroup
}

export { WidgetProps, WidgetConfig }
