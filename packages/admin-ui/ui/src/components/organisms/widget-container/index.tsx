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
import React from "react"
import ExtensionErrorBoundary from "../../molecules/extension-error-boundary"
import { useWidgetContainerProps } from "./use-widget-container-props"

type EntityMap = {
  "product.details": Product
  "product_category.details": ProductCategory
  "product_collection.details": ProductCollection
  "order.details": Order
  "customer.details": Customer
  "customer_group.details": CustomerGroup
  "price_list.details": PriceList
}

type PropKeyMap = {
  "product.details": "product"
  "product_category.details": "productCategory"
  "product_collection.details": "productCollection"
  "order.details": "order"
  "customer.details": "customer"
  "customer_group.details": "customerGroup"
  "price_list.details": "priceList"
}

type WidgetContainerProps<T extends keyof EntityMap> = {
  injectionZone: T
  widget: LoadedWidget
  entity: EntityMap[T]
} & {
  [K in PropKeyMap[T]]?: EntityMap[T]
}

const WidgetContainer = <T extends InjectionZone>({
  injectionZone,
  widget,
  entity,
}: WidgetContainerProps<T>) => {
  const { name, origin, Component } = widget

  const baseProps = useWidgetContainerProps()

  const propKey = injectionZone.split(".")[0] as keyof PropKeyMap
  const props = {
    [propKey]: entity,
    ...baseProps,
  }

  return (
    <ExtensionErrorBoundary
      type="widget"
      info={{
        name,
        origin,
      }}
    >
      {React.createElement(Component, props)}
    </ExtensionErrorBoundary>
  )
}

export default WidgetContainer
