import React, { useContext } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../../../components/fundamentals/button"
import { LayeredModalContext } from "../../../../../../components/molecules/modal/layered-modal"
import { useConditions } from "../../../../details/conditions/add-condition/conditions-provider"
import { DiscountConditionOperator } from "../../../../types"

type AddConditionFooterProps = {
  type:
    | "products"
    | "product_collections"
    | "product_types"
    | "product_tags"
    | "customer_groups"
  items: { id: string; label: string }[]
  operator: DiscountConditionOperator
  onClose: () => void
}

const DetailsConditionFooter: React.FC<AddConditionFooterProps> = ({
  type,
  items,
  operator,
  onClose,
}) => {
  const { t } = useTranslation()
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition, updateAndSave } = useConditions()

  return (
    <div className="gap-x-xsmall flex w-full justify-end">
      <Button variant="ghost" size="small" onClick={onClose}>
        {t("details-condition-tables-cancel", "Cancel")}
      </Button>
      <Button
        variant="primary"
        size="small"
        onClick={() => {
          updateCondition({
            type,
            items,
            operator,
          })
          pop()
        }}
      >
        {t("details-condition-tables-save-and-add-more", "Save and add more")}
      </Button>
      <Button
        variant="primary"
        size="small"
        onClick={() => {
          updateAndSave({ type, items, operator })
          onClose()
          reset()
        }}
      >
        {t("details-condition-tables-save-and-close", "Save and close")}
      </Button>
    </div>
  )
}

export default DetailsConditionFooter
