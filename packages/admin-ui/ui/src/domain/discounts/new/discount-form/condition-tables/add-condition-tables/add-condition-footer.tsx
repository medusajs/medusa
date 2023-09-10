import React, { useContext } from "react"
import Button from "../../../../../../components/fundamentals/button"
import { LayeredModalContext } from "../../../../../../components/molecules/modal/layered-modal"
import { DiscountConditionOperator } from "../../../../types"
import { useDiscountForm } from "../../form/discount-form-context"
import { useTranslation } from "react-i18next"

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

const AddConditionFooter: React.FC<AddConditionFooterProps> = ({
  type,
  items,
  operator,
  onClose,
}) => {
  const { t } = useTranslation()
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition } = useDiscountForm()

  return (
    <div className="gap-x-xsmall flex w-full justify-end">
      <Button
        variant="ghost"
        size="small"
        onClick={() => {
          onClose()
          reset()
        }}
      >
        {t("add-condition-tables-cancel", "Cancel")}
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
        {t("add-condition-tables-save-and-add-more", "Save and add more")}
      </Button>
      <Button
        variant="primary"
        size="small"
        onClick={() => {
          updateCondition({ type, items, operator })
          onClose()
          reset()
        }}
      >
        {t("add-condition-tables-save-and-close", "Save and close")}
      </Button>
    </div>
  )
}

export default AddConditionFooter
