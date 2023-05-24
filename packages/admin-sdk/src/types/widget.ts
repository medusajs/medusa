import { ExtensionProps } from "@medusajs/admin-shared"
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

export interface OrderWidgetProps extends ExtensionProps {
  order: Order
}

export interface ProductWidgetProps extends ExtensionProps {
  product: Product
}

export interface ProductCollectionWidgetProps extends ExtensionProps {
  productCollection: ProductCollection
}

export interface CustomerWidgetProps extends ExtensionProps {
  customer: Customer
}

export interface CustomerGroupWidgetProps extends ExtensionProps {
  customerGroup: CustomerGroup
}

export interface DiscountWidgetProps extends ExtensionProps {
  discount: Discount
}

export interface PriceListWidgetProps extends ExtensionProps {
  priceList: PriceList
}

export interface GiftCardWidgetProps extends ExtensionProps {
  giftCard: Product
}

export interface CustomGiftCardWidgetProps extends ExtensionProps {
  giftCard: GiftCard
}

export interface DraftOrderWidgetProps extends ExtensionProps {
  draftOrder: DraftOrder
}

export interface ListWidgetProps extends ExtensionProps {}

export interface LoginWidgetProps extends ExtensionProps {}
