import { DiscountCondition } from "@medusajs/medusa"
import React from "react"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import AddCollectionConditionsScreen from "./add-condition-resources/collections/add-collections"
import AddCustomerGroupsConditionsScreen from "./add-condition-resources/customer-groups/add-customer-groups"
import AddTypesConditionsScreen from "./add-condition-resources/product-types/add-types"
import AddProductConditionsScreen from "./add-condition-resources/products/add-products"
import AddTagsConditionsScreen from "./add-condition-resources/tags/add-tags"
import { useTranslation } from "react-i18next"

export const useAddConditionsModalScreen = (condition: DiscountCondition) => {
  const { t } = useTranslation()
  const { pop } = React.useContext(LayeredModalContext)

  const renderModalScreen = () => {
    switch (condition.type) {
      case "products":
        return <AddProductConditionsScreen />
      case "product_collections":
        return <AddCollectionConditionsScreen />
      case "product_types":
        return <AddTypesConditionsScreen />
      case "product_tags":
        return <AddTagsConditionsScreen />
      case "customer_groups":
        return <AddCustomerGroupsConditionsScreen />
    }
  }

  return {
    title: t("edit-condition-add-conditions", "Add conditions"),
    onBack: pop,
    view: renderModalScreen(),
  }
}
