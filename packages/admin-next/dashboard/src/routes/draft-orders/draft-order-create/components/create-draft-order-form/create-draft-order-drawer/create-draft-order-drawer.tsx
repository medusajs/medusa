import { View } from "../constants"
import { AddCustomItemDrawer } from "./add-custom-item-drawer"
import { AddVariantDrawer } from "./add-variant-drawer"

export const CreateDraftOrderDrawer = ({ view }: { view: View | null }) => {
  switch (view) {
    case View.EXISTING_ITEMS:
      return <AddVariantDrawer />
    case View.CUSTOM_ITEMS:
      return <AddCustomItemDrawer />
    default:
      return null
  }
}
