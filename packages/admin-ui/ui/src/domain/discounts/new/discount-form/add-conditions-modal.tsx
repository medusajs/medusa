import React, { useContext, useEffect, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import ChevronRightIcon from "../../../../components/fundamentals/icons/chevron-right-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import { AddConditionSelectorProps, ConditionMap } from "../../types"
import useConditionModalItems, {
  ConditionItem,
} from "./use-condition-modal-items"

type AddConditionsModalProps = AddConditionSelectorProps & {
  isDetails?: boolean
  conditions: ConditionMap
  save?: () => void
}

const AddConditionsModal = ({
  onClose,
  conditions,
  save,
  isDetails = false,
}: AddConditionsModalProps) => {
  const layeredModalContext = useContext(LayeredModalContext)

  const [items, setItems] = useState<ConditionItem[]>(
    useConditionModalItems({ onClose, isDetails })
  )

  useEffect(() => {
    const setConditions: string[] = []

    for (const [key, value] of Object.entries(conditions)) {
      // If we are in the details view we only want to view the conditions that haven't already been added,
      // meaning !id. We don't support updating existing conditions through the admin atm.
      const filter = isDetails ? value.id : value.items.length

      if (filter) {
        setConditions.push(key)
      }
    }

    setItems(items.filter((i) => !setConditions.includes(i.value)))
  }, [conditions])

  return (
    <LayeredModal context={layeredModalContext} handleClose={onClose}>
      <Modal.Body className="h-[calc(100vh-134px)] flex flex-col">
        <Modal.Header handleClose={onClose}>
          <span className="inter-xlarge-semibold">Add Conditions</span>
          <span className="font-semibold text-grey-90 mt-6 flex items-center gap-1">
            Choose a condition type{" "}
            <IconTooltip content="You can only add one of each type of condition" />
          </span>
        </Modal.Header>

        <Modal.Content className="flex-1">
          {items.length ? (
            items.map((t) => <ConditionTypeItem key={t.value} {...t} />)
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 h-full">
              <span className="inter-base-regular text-grey-40">
                Can't add anymore conditions
              </span>
            </div>
          )}
        </Modal.Content>

        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 text-small justify-center"
              size="small"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (save) {
                  save()
                }
                onClose()
              }}
              size="small"
              className="w-32 text-small justify-center"
              variant="primary"
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

const ConditionTypeItem: React.FC<ConditionItem> = (props) => {
  const { label, description, onClick } = props

  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-1 p-4 mb-2 cursor-pointer hover:bg-grey-5 transition-all w-full flex items-center justify-between"
    >
      <div className="flex flex-col items-start">
        <div className="font-semibold ">{label}</div>
        <div className="text-grey-50">{description}</div>
      </div>
      <ChevronRightIcon width={16} height={32} className="text-grey-50" />
    </button>
  )
}

export default AddConditionsModal
