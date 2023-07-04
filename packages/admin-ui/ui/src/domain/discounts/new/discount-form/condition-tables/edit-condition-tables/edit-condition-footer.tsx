import React from "react"
import Button from "../../../../../../components/fundamentals/button"
import { DiscountConditionOperator } from "../../../../types"
import { useDiscountForm } from "../../form/discount-form-context"

type EditConditionFooterProps = {
  onClose: () => void
  type:
    | "products"
    | "product_collections"
    | "product_types"
    | "product_tags"
    | "customer_groups"
  items: { id: string; label: string }[]
  operator: DiscountConditionOperator
}

const EditConditionFooter: React.FC<EditConditionFooterProps> = ({
  type,
  items,
  operator,
  onClose,
}) => {
  const { updateCondition } = useDiscountForm()
  return (
    <div className="gap-x-xsmall flex w-full items-center justify-end">
      <Button variant="secondary" size="small" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="danger"
        size="small"
        onClick={() => {
          updateCondition({
            type,
            items: [],
            operator: DiscountConditionOperator.IN,
          })
          onClose()
        }}
      >
        Delete condition
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
          onClose()
        }}
        className="min-w-[128px]"
      >
        Save
      </Button>
    </div>
  )
}

export default EditConditionFooter
