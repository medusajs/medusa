import React, { useContext } from "react"
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
  const { pop, reset } = useContext(LayeredModalContext)
  const { updateCondition, updateAndSave } = useConditions()

  return (
    <div className="w-full flex justify-end gap-x-xsmall">
      <Button variant="ghost" size="small" onClick={onClose}>
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
          updateAndSave({ type, items, operator })
          onClose()
          reset()
        }}
      >
        Save and close
      </Button>
    </div>
  )
}

export default DetailsConditionFooter
