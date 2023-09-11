import { useAdminGetDiscountCondition } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import Badge from "../../../../../../components/fundamentals/badge"
import EditIcon from "../../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../../components/fundamentals/icons/trash-icon"
import Actionables from "../../../../../../components/molecules/actionables"
import {
  ConditionMap,
  DiscountConditionOperator,
  DiscountConditionType,
} from "../../../../types"
import EditConditionsModal from "../../edit-conditions-modal"
import { useDiscountForm } from "../../form/discount-form-context"
import { useTranslation } from "react-i18next"
import { TFunction } from "i18next"

type ConditionItemProps<Type extends DiscountConditionType> = {
  index: number
  discountId?: string
  conditionId?: string
  type: Type
  setCondition: React.Dispatch<React.SetStateAction<ConditionMap>>
  items: { id: string; label: string }[]
}

const ConditionItem = <Type extends DiscountConditionType>({
  index,
  discountId,
  conditionId,
  type,
  setCondition,
  items,
}: ConditionItemProps<Type>) => {
  const { t } = useTranslation()
  const queryParams = useMemo(() => {
    switch (type) {
      case DiscountConditionType.PRODUCTS:
        return { expand: "products" }
      case DiscountConditionType.PRODUCT_COLLECTIONS:
        return { expand: "product_collections" }
      case DiscountConditionType.PRODUCT_TAGS:
        return { expand: "product_tags" }
      case DiscountConditionType.CUSTOMER_GROUPS:
        return { expand: "customer_groups" }
      case DiscountConditionType.PRODUCT_TYPES:
        return { expand: "product_types" }
    }
  }, [type])

  const { discount_condition } = useAdminGetDiscountCondition(
    discountId!,
    conditionId!,
    queryParams,
    {
      enabled: !!discountId && !!conditionId,
      cacheTime: 0,
    }
  )

  const { updateCondition } = useDiscountForm()

  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    if (!discount_condition) {
      return
    }

    switch (type) {
      case DiscountConditionType.PRODUCTS:
        setCondition((prevConditions) => {
          return {
            ...prevConditions,
            products: {
              ...prevConditions.products,
              id: discount_condition.id,
              operator: discount_condition.operator,
              items: discount_condition.products.map((p) => ({
                id: p.id,
                label: p.title,
              })),
            },
          }
        })
        break
      case DiscountConditionType.PRODUCT_COLLECTIONS:
        setCondition((prevConditions) => {
          return {
            ...prevConditions,
            product_collections: {
              ...prevConditions.product_collections,
              id: discount_condition.id,
              operator: discount_condition.operator,
              items: discount_condition.product_collections.map((p) => ({
                id: p.id,
                label: p.title,
              })),
            },
          }
        })
        break
      case DiscountConditionType.PRODUCT_TAGS:
        setCondition((prevConditions) => {
          return {
            ...prevConditions,
            product_tags: {
              ...prevConditions.product_tags,
              id: discount_condition.id,
              operator: discount_condition.operator,
              items: discount_condition.product_tags.map((p) => ({
                id: p.id,
                label: p.value,
              })),
            },
          }
        })
        break
      case DiscountConditionType.CUSTOMER_GROUPS:
        setCondition((prevConditions) => {
          return {
            ...prevConditions,
            customer_groups: {
              ...prevConditions.customer_groups,
              id: discount_condition.id,
              operator: discount_condition.operator,
              items: discount_condition.customer_groups.map((p) => ({
                id: p.id,
                label: p.name,
              })),
            },
          }
        })
        break
      case DiscountConditionType.PRODUCT_TYPES:
        setCondition((prevConditions) => {
          return {
            ...prevConditions,
            product_types: {
              ...prevConditions.product_types,
              id: discount_condition.id,
              operator: discount_condition.operator,
              items: discount_condition.product_types.map((p) => ({
                id: p.id,
                label: p.value,
              })),
            },
          }
        })
        break
    }
  }, [discount_condition, type])

  const [visibleItems, remainder] = useMemo(() => {
    const columns = Math.max(Math.floor(400 / 110) - 1, 1)
    const visibleItems = items.slice(0, columns)
    const remainder = items.length - columns

    return [visibleItems, remainder]
  }, [items])

  // If no items in the list, don't render anything
  if (!items.length) {
    return null
  }

  return (
    <div>
      <div className="p-base rounded-rounded gap-base flex items-center justify-between border">
        <div className="gap-base flex w-full overflow-hidden">
          <div>
            <Badge
              className="inter-base-semibold flex h-[40px] w-[40px] items-center justify-center"
              variant="default"
            >
              §{index + 1}
            </Badge>
          </div>
          <div className="flex w-full flex-1 flex-col justify-center truncate">
            <div className="inter-small-semibold">{getTitle(type, t)}</div>
            <div className="inter-small-regular gap-x-xsmall flex w-full flex-1 items-center">
              <div className="gap-x-2xsmall text-grey-50 inter-small-regular flex w-full flex-1 items-center">
                {visibleItems.map((item, i) => {
                  return (
                    <span key={i}>
                      {type === DiscountConditionType.PRODUCT_TAGS && "#"}
                      {item.label}
                      {i !== visibleItems.length - 1 && ", "}
                    </span>
                  )
                })}
                {remainder > 0 && (
                  <span className="text-grey-40 ml-2">
                    {t("condition-item-remainder-more", "+{{remainder}} more", {
                      remainder,
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <Actionables
            forceDropdown
            actions={[
              {
                label: t("conditions-edit", "Edit"),
                onClick: () => setShowEdit(true),
                icon: <EditIcon size={16} />,
              },
              {
                label: t("conditions-delete-condition", "Delete condition"),
                onClick: () =>
                  updateCondition({
                    type,
                    items: [],
                    operator: DiscountConditionOperator.IN,
                  }),
                icon: <TrashIcon size={16} />,
                variant: "danger",
              },
            ]}
          />
        </div>
      </div>
      {showEdit && (
        <EditConditionsModal onClose={() => setShowEdit(false)} view={type} />
      )}
    </div>
  )
}

const getTitle = (type: DiscountConditionType, t: TFunction) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return t("conditions-product", "Product")
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return t("conditions-collection", "Collection")
    case DiscountConditionType.PRODUCT_TAGS:
      return t("conditions-tag", "Tag")
    case DiscountConditionType.CUSTOMER_GROUPS:
      return t("conditions-customer-group", "Customer group")
    case DiscountConditionType.PRODUCT_TYPES:
      return t("conditions-type", "Type")
  }
}

export default ConditionItem
