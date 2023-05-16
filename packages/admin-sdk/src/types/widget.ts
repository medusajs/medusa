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

export interface CustomerGroupWidgetProps extends WidgetProps {
  customerGroup: CustomerGroup
}

export interface DiscountWidgetProps extends WidgetProps {
  discount: Discount
}

export interface PriceListWidgetProps extends WidgetProps {
  priceList: PriceList
}

export interface GiftCardWidgetProps extends WidgetProps {
  giftCard: Product
}

export interface CustomGiftCardWidgetProps extends WidgetProps {
  giftCard: GiftCard
}

export interface DraftOrderWidgetProps extends WidgetProps {
  draftOrder: DraftOrder
}

export interface ListWidgetProps extends WidgetProps {}

export interface LoginWidgetProps extends WidgetProps {}
