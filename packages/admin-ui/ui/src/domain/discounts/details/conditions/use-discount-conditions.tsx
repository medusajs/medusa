import { Discount } from "@medusajs/medusa"
import {
  useAdminDiscount,
  useAdminDiscountRemoveCondition,
  useAdminGetDiscountCondition,
} from "medusa-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../components/molecules/actionables"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { DiscountConditionType } from "../../types"
import { TFunction } from "i18next"

export const useDiscountConditions = (discount: Discount) => {
  const { t } = useTranslation()
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  )

  const { refetch } = useAdminDiscount(discount.id)
  const { discount_condition } = useAdminGetDiscountCondition(
    discount.id,
    selectedCondition!,
    {
      expand:
        "product_collections,product_tags,product_types,customer_groups,products",
    },
    { enabled: !!selectedCondition, cacheTime: 0 }
  )
  const { mutate } = useAdminDiscountRemoveCondition(discount.id)

  const notification = useNotification()

  const removeCondition = (conditionId: string) => {
    mutate(conditionId, {
      onSuccess: () => {
        notification(
          t("conditions-success", "Success"),
          t("conditions-condition-removed", "Condition removed"),
          "success"
        )
        refetch()
      },
      onError: (error) => {
        notification(
          t("conditions-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      },
    })
  }

  const itemized = discount.rule.conditions.map((condition) => ({
    type: condition.type,
    title: getTitle(condition.type),
    description: getDescription(condition.type, t),
    actions: [
      {
        label: t("conditions-edit-condition", "Edit condition"),
        icon: <EditIcon size={16} />,
        variant: "ghost",
        onClick: () => setSelectedCondition(condition.id),
      },
      {
        label: t("conditions-delete-condition", "Delete condition"),
        icon: <TrashIcon size={16} />,
        variant: "danger",
        onClick: () => removeCondition(condition.id),
      },
    ] as ActionType[],
  }))

  function deSelectCondition() {
    setSelectedCondition(null)
  }

  return {
    conditions: itemized,
    selectedCondition: discount_condition,
    deSelectCondition,
  }
}

const getTitle = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "Product"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "Collection"
    case DiscountConditionType.PRODUCT_TAGS:
      return "Tag"
    case DiscountConditionType.PRODUCT_TYPES:
      return "Type"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "Customer Group"
  }
}

const getDescription = (type: DiscountConditionType, t: TFunction) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return t(
        "conditions-discount-is-applicable-to-specific-products",
        "Discount is applicable to specific products"
      )
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return t(
        "conditions-discount-is-applicable-to-specific-collections",
        "Discount is applicable to specific collections"
      )
    case DiscountConditionType.PRODUCT_TAGS:
      return t(
        "conditions-discount-is-applicable-to-specific-product-tags",
        "Discount is applicable to specific product tags"
      )
    case DiscountConditionType.PRODUCT_TYPES:
      return t(
        "conditions-discount-is-applicable-to-specific-product-types",
        "Discount is applicable to specific product types"
      )
    case DiscountConditionType.CUSTOMER_GROUPS:
      return t(
        "conditions-discount-is-applicable-to-specific-customer-groups",
        "Discount is applicable to specific customer groups"
      )
  }
}
