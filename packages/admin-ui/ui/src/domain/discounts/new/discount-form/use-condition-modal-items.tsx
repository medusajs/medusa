import { useContext, useMemo } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()

  const items: ConditionItem[] = useMemo(
    () => [
      {
        label: t("discount-form-product", "Product"),
        value: DiscountConditionType.PRODUCTS,
        description: t(
          "discount-form-only-for-specific-products",
          "Only for specific products"
        ),
        onClick: () =>
          layeredModalContext.push({
            title: t("discount-form-choose-products", "Choose products"),
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsProductConditionSelector onClose={onClose} />
            ) : (
              <AddProductConditionSelector onClose={onClose} />
            ),
          }),
      },
      {
        label: t("discount-form-customer-group", "Customer group"),
        value: DiscountConditionType.CUSTOMER_GROUPS,
        description: t(
          "discount-form-only-for-specific-customer-groups",
          "Only for specific customer groups"
        ),
        onClick: () => {
          layeredModalContext.push({
            title: t("discount-form-choose-groups", "Choose groups"),
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
        label: t("discount-form-tag", "Tag"),
        value: DiscountConditionType.PRODUCT_TAGS,
        description: t(
          "discount-form-only-for-specific-tags",
          "Only for specific tags"
        ),
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
        label: t("discount-form-collection", "Collection"),
        value: DiscountConditionType.PRODUCT_COLLECTIONS,
        description: t(
          "discount-form-only-for-specific-product-collections",
          "Only for specific product collections"
        ),
        onClick: () =>
          layeredModalContext.push({
            title: t("discount-form-choose-collections", "Choose collections"),
            onBack: () => layeredModalContext.pop(),
            view: isDetails ? (
              <DetailsCollectionConditionSelector onClose={onClose} />
            ) : (
              <AddCollectionConditionSelector onClose={onClose} />
            ),
          }),
      },
      {
        label: t("discount-form-type", "Type"),
        value: DiscountConditionType.PRODUCT_TYPES,
        description: t(
          "discount-form-only-for-specific-product-types",
          "Only for specific product types"
        ),
        onClick: () =>
          layeredModalContext.push({
            title: t("discount-form-choose-types", "Choose types"),
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
