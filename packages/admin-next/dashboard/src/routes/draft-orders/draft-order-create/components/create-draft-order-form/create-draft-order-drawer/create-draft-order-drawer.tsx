import { View } from "../constants"
import { CustomItem, ExistingItem, ShippingMethod } from "../types"
import { AddCustomItemDrawer } from "./add-custom-item-drawer"
import { AddShippingMethodDrawer } from "./add-shipping-method-drawer"
import { AddVariantDrawer } from "./add-variant-drawer"

export const CreateDraftOrderDrawer = ({
  view,
  variants,
  custom,
  shippingMethods,
}: {
  view: View | null
  variants: {
    regionId?: string
    customerId?: string
    currencyCode: string
    items?: ExistingItem[]
    onSave: (items: ExistingItem[]) => void
  }
  custom: {
    onSave: (item: CustomItem) => void
    currencyCode: string
    nativeSymbol: string
  }
  shippingMethods: {
    regionId?: string
    onSave: (items: ShippingMethod[]) => void
  }
}) => {
  switch (view) {
    case View.EXISTING_ITEMS:
      return <AddVariantDrawer {...variants} />
    case View.CUSTOM_ITEMS:
      return <AddCustomItemDrawer {...custom} />
    case View.SHIPPING_METHODS:
      return <AddShippingMethodDrawer {...shippingMethods} />
    default:
      return null
  }
}
