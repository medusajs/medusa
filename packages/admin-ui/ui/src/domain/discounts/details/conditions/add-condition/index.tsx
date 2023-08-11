import React from "react"
import AddConditionsModal from "../../../new/discount-form/add-conditions-modal"
import { useConditions } from "./conditions-provider"

type AddConditionProps = {
  show: boolean
  onClose: () => void
}

const AddCondition: React.FC<AddConditionProps> = ({ show, onClose }) => {
  const { conditions, save, reset } = useConditions()

  return (
    <div>
      {show && (
        <AddConditionsModal
          isDetails={true}
          onClose={() => {
            onClose()
            reset()
          }}
          conditions={conditions}
          save={save}
        />
      )}
    </div>
  )
}

export default AddCondition
