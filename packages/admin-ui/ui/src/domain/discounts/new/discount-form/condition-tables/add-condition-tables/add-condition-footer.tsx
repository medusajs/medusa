import React, { useContext } from "react"
import Button from "../../../../../../components/fundamentals/button"
import { LayeredModalContext } from "../../../../../../components/molecules/modal/layered-modal"
import { DiscountConditionOperator } from "../../../../types"
import { useDiscountForm } from "../../form/discount-form-context"

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
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition } = useDiscountForm()

  return (
    <div className="w-full flex justify-end gap-x-xsmall">
      <Button
        variant="ghost"
        size="small"
        onClick={() => {
          onClose()
          reset()
        }}
      >
        Cancel
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
        Save and add more
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
        Save and close
      </Button>
    </div>
  )
}

export default AddConditionFooter
