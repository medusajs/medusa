import * as React from "react"
import { useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../../components/molecules/modal/focus-modal"
import Accordion from "../../../../components/organisms/accordion"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { DiscountRuleType } from "../../types"
import { useDiscountForm } from "./form/discount-form-context"
import { DiscountFormValues } from "./form/mappers"
import { useFormActions } from "./form/use-form-actions"
import DiscountNewConditions from "./sections/conditions"
import Configuration from "./sections/configuration"
import DiscountAllocation from "./sections/discount-allocation"
import DiscountType from "./sections/discount-type"
import General from "./sections/general"

type DiscountFormProps = {
  closeForm?: () => void
}


const DiscountForm = ({ closeForm }: DiscountFormProps) => {
  const navigate = useNavigate()
  const notification = useNotification()
  const { handleSubmit, handleReset, control } = useDiscountForm()

  const { onSaveAsActive, onSaveAsInactive } = useFormActions()

  const closeFormModal = () => {
    if (closeForm) {
      closeForm()
    } else {
      navigate("/a/discounts")
    }
    handleReset()
  }

  const submitGhost = async (data: DiscountFormValues) => {
    onSaveAsInactive(data)
      .then(() => {
        closeFormModal()
        handleReset()
      })
      .catch((error) => {
        notification("Error", getErrorMessage(error), "error")
      })
  }

  const submitCTA = async (data: DiscountFormValues) => {
    try {
      await onSaveAsActive(data)
      closeFormModal()
      handleReset()
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
    }
  }

  const discountType = useWatch({
    control,
    name: "rule.type",
  })

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 w-full px-8 flex justify-between">
          <Button
            size="small"
            variant="ghost"
            onClick={closeForm}
            className="border rounded-rounded w-8 h-8"
          >
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              onClick={handleSubmit(submitGhost)}
              size="small"
              variant="ghost"
              className="border rounded-rounded"
            >
              Save as draft
            </Button>
            <Button
              size="small"
              variant="primary"
              onClick={handleSubmit(submitCTA)}
              className="rounded-rounded"
            >
              Publish discount
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="flex justify-center mb-[25%]">
          <div className="max-w-[700px] w-full pt-16">
            <h1 className="inter-xlarge-semibold">Create new discount</h1>
            <Accordion
              className="pt-7 text-grey-90"
              defaultValue={["promotion-type"]}
              type="multiple"
            >
              <Accordion.Item
                forceMountContent
                title="Discount type"
                required
                tooltip="Select a discount type"
                value="promotion-type"
              >
                <DiscountType />
                {discountType === DiscountRuleType.FIXED && (
                  <div className="mt-xlarge">
                    <h3 className="inter-base-semibold">
                      Allocation<span className="text-rose-50">*</span>
                    </h3>
                    <DiscountAllocation />
                  </div>
                )}
              </Accordion.Item>
              <Accordion.Item
                title="General"
                required
                value="general"
                forceMountContent
              >
                <General />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title="Configuration"
                value="configuration"
                description="Discount code applies from you hit the publish button and forever if left untouched."
              >
                <Configuration />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title="Conditions"
                description="Discount code apply to all products if left untouched."
                value="conditions"
                tooltip="Add conditions to your Discount"
              >
                <DiscountNewConditions />
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default DiscountForm
