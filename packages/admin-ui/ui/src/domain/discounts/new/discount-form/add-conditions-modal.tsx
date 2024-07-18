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
import { useTranslation } from "react-i18next"

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
  const { t } = useTranslation()
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
      <Modal.Body className="flex h-[calc(100vh-134px)] flex-col">
        <Modal.Header handleClose={onClose}>
          <span className="inter-xlarge-semibold">
            {t("discount-form-add-conditions", "Add Conditions")}
          </span>
          <span className="text-grey-90 mt-6 flex items-center gap-1 font-semibold">
            {t(
              "discount-form-choose-a-condition-type",
              "Choose a condition type"
            )}{" "}
            <IconTooltip
              content={t(
                "discount-form-you-can-only-add-one-of-each-type-of-condition",
                "You can only add one of each type of condition"
              )}
            />
          </span>
        </Modal.Header>

        <Modal.Content className="flex-1">
          {items.length ? (
            items.map((t) => <ConditionTypeItem key={t.value} {...t} />)
          ) : (
            <div className="flex h-full flex-1 flex-col items-center justify-center">
              <span className="inter-base-regular text-grey-40">
                {t(
                  "discount-form-you-cannot-add-any-more-conditions",
                  "You cannot add any more conditions"
                )}
              </span>
            </div>
          )}
        </Modal.Content>

        <Modal.Footer>
          <div className="flex h-8 w-full justify-end">
            <Button
              variant="ghost"
              className="text-small me-2 w-32 justify-center"
              size="small"
              onClick={onClose}
            >
              {t("discount-form-cancel", "Cancel")}
            </Button>
            <Button
              onClick={() => {
                if (save) {
                  save()
                }
                onClose()
              }}
              size="small"
              className="text-small w-32 justify-center"
              variant="primary"
            >
              {t("discount-form-save", "Save")}
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
      className="border-1 hover:bg-grey-5 mb-2 flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 transition-all"
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
