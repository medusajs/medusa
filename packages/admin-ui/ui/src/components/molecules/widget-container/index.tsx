import {
  Customer,
  CustomerGroup,
  Order,
  PriceList,
  Product,
  ProductCategory,
  ProductCollection,
} from "@medusajs/medusa"
import { InjectionZone, LoadedWidget } from "@medusajs/types"
import ExtensionErrorBoundary from "../extension-error-boundary"

type EntityMap = {
  "product.details": Product
  "product_category.details": ProductCategory
  "product_collection.details": ProductCollection
  "order.details": Order
  "customer.details": Customer
  "customer_group.details": CustomerGroup
  "price_list.details": PriceList
}

type WidgetContainerProps<T extends keyof EntityMap> = {
  injectionZone: T
  widget: LoadedWidget
  entity: EntityMap[T]
}

const WidgetContainer = <T extends InjectionZone>({
  injectionZone,
  widget,
  entity,
}: WidgetContainerProps<T>) => {
  const { name, origin, Component } = widget

  return (
    <ExtensionErrorBoundary
      info={{
        name,
        origin,
      }}
    >
      <Component />
    </ExtensionErrorBoundary>
  )
}

export default WidgetContainer
