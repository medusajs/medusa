import { useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import MetadataForm from "../../../../components/forms/general/metadata-form"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../../components/molecules/modal/focus-modal"
import Accordion from "../../../../components/organisms/accordion"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
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
  const { handleSubmit, handleReset, control, form } = useDiscountForm()
  const { t } = useTranslation()

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
        notification(
          t("discount-form-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      })
  }

  const submitCTA = async (data: DiscountFormValues) => {
    try {
      await onSaveAsActive(data)
      closeFormModal()
      handleReset()
    } catch (error) {
      notification(
        t("discount-form-error", "Error"),
        getErrorMessage(error),
        "error"
      )
    }
  }

  const discountType = useWatch({
    control,
    name: "rule.type",
  })

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 flex w-full justify-between px-8">
          <Button
            size="small"
            variant="ghost"
            onClick={closeForm}
            className="rounded-rounded h-8 w-8 border"
          >
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              onClick={handleSubmit(submitGhost)}
              size="small"
              variant="ghost"
              className="rounded-rounded border"
            >
              {t("discount-form-save-as-draft", "Save as draft")}
            </Button>
            <Button
              size="small"
              variant="primary"
              onClick={handleSubmit(submitCTA)}
              className="rounded-rounded"
            >
              {t("discount-form-publish-discount", "Publish discount")}
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="mb-[25%] flex justify-center">
          <div className="w-full max-w-[700px] pt-16">
            <h1 className="inter-xlarge-semibold">
              {t("discount-form-create-new-discount", "Create new discount")}
            </h1>
            <Accordion
              className="text-grey-90 pt-7"
              defaultValue={["promotion-type"]}
              type="multiple"
            >
              <Accordion.Item
                forceMountContent
                title={t("discount-form-discount-type", "Discount type")}
                required
                tooltip={t(
                  "discount-form-select-a-discount-type",
                  "Select a discount type"
                )}
                value="promotion-type"
              >
                <DiscountType />
                {discountType === DiscountRuleType.FIXED && (
                  <div className="mt-xlarge">
                    <h3 className="inter-base-semibold">
                      {t("discount-form-allocation", "Allocation")}
                      <span className="text-rose-50">*</span>
                    </h3>
                    <DiscountAllocation />
                  </div>
                )}
              </Accordion.Item>
              <Accordion.Item
                title={t("discount-form-general", "General")}
                required
                value="general"
                forceMountContent
              >
                <General />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title={t("discount-form-configuration", "Configuration")}
                value="configuration"
                description={t(
                  "discount-form-discount-code-application-disclaimer",
                  "Discount code applies from when you hit the publish button and forever if left untouched."
                )}
              >
                <Configuration />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title={t("discount-form-conditions", "Conditions")}
                description={t(
                  "discount-form-discount-code-apply-to-all-products-if-left-untouched",
                  "Discount code apply to all products if left untouched."
                )}
                value="conditions"
                tooltip={t(
                  "discount-form-add-conditions-to-your-discount",
                  "Add conditions to your Discount"
                )}
              >
                <DiscountNewConditions />
              </Accordion.Item>
              <Accordion.Item
                title={t("discount-form-metadata", "Metadata")}
                subtitle={t(
                  "discount-form-metadata-usage-description",
                  "Metadata allows you to add additional information to your discount."
                )}
                value="metadata"
                forceMountContent
              >
                <div className="mt-small">
                  <MetadataForm form={nestedForm(form, "metadata")} />
                </div>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default DiscountForm
