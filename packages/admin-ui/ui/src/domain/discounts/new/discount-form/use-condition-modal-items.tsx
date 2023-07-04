import { useContext, useMemo } from "react"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import { DiscountConditionType } from "../../types"
import AddCollectionConditionSelector from "./condition-tables/add-condition-tables/collections"
import AddCustomerGroupConditionSelector from "./condition-tables/add-condition-tables/customer-groups"
import AddProductConditionSelector from "./condition-tables/add-condition-tables/products"
import AddTagConditionSelector from "./condition-tables/add-condition-tables/tags"
import AddTypeConditionSelector from "./condition-tables/add-condition-tables/types"
import DetailsCollectionConditionSelector from "./condition-tables/details-condition-tables/collections"
import DetailsCustomerGroupConditionSelector from "./condition-tables/details-condition-tables/customer-groups"
import DetailsProductConditionSelector from "./condition-tables/details-condition-tables/products"
import DetailsTagConditionSelector from "./condition-tables/details-condition-tables/tags"
import DetailsTypeConditionSelector from "./condition-tables/details-condition-tables/types"

export type ConditionItem = {
  label: string
  value: DiscountConditionType
  description: string
  onClick: () => void
}

type UseConditionModalItemsProps = {
  onClose: () => void
  isDetails?: boolean
}

const useConditionModalItems = ({
  isDetails,
  onClose,
}: UseConditionModalItemsProps) => {
  const layeredModalContext = useContext(LayeredModalContext)

  const items: ConditionItem[] = useMemo(
    () => [
      {
        label: "Product",
        value: DiscountConditionType.PRODUCTS,
        description: "Only for specific products",
        onClick: () =>
          layeredModalContext.push({
            title: "Choose products",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsProductConditionSelector onClose={onClose} />
            ) : (
              <AddProductConditionSelector onClose={onClose} />
            ),
          }),
      },
      {
        label: "Customer group",
        value: DiscountConditionType.CUSTOMER_GROUPS,
        description: "Only for specific customer groups",
        onClick: () => {
          layeredModalContext.push({
            title: "Choose groups",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsCustomerGroupConditionSelector onClose={onClose} />
            ) : (
              <AddCustomerGroupConditionSelector onClose={onClose} />
            ),
          })
        },
      },
      {
        label: "Tag",
        value: DiscountConditionType.PRODUCT_TAGS,
        description: "Only for specific tags",
        onClick: () =>
          layeredModalContext.push({
            title: "Choose tags",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsTagConditionSelector onClose={onClose} />
            ) : (
              <AddTagConditionSelector onClose={onClose} />
            ),
          }),
      },
      {
        label: "Collection",
        value: DiscountConditionType.PRODUCT_COLLECTIONS,
        description: "Only for specific product collections",
        onClick: () =>
          layeredModalContext.push({
            title: "Choose collections",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsCollectionConditionSelector onClose={onClose} />
            ) : (
              <AddCollectionConditionSelector onClose={onClose} />
            ),
          }),
      },
      {
        label: "Type",
        value: DiscountConditionType.PRODUCT_TYPES,
        description: "Only for specific product types",
        onClick: () =>
          layeredModalContext.push({
            title: "Choose types",
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsTypeConditionSelector onClose={onClose} />
            ) : (
              <AddTypeConditionSelector onClose={onClose} />
            ),
          }),
      },
    ],
    [isDetails]
  )

  return items
}

export default useConditionModalItems
