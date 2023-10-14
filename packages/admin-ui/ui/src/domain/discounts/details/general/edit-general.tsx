import { Discount } from "@medusajs/medusa"
import { useAdminUpdateDiscount } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import DiscountGeneralForm, {
  DiscountGeneralFormType,
} from "../../../../components/forms/discount/discount-general-form"
import MetadataForm, {
  getMetadataFormValues,
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../../components/forms/general/metadata-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"

type EditGeneralProps = {
  discount: Discount
  open: boolean
  onClose: () => void
}

type GeneralForm = {
  general: DiscountGeneralFormType
  metadata: MetadataFormType
}

const EditGeneral: React.FC<EditGeneralProps> = ({
  discount,
  open,
  onClose,
}) => {
  const { t } = useTranslation()
  const { mutate, isLoading } = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const form = useForm<GeneralForm>({
    defaultValues: getDefaultValues(discount),
  })

  const { handleSubmit, reset } = form

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        regions: data.general.region_ids.map((r) => r.value),
        code: data.general.code,
        rule: {
          id: discount.rule.id,
          description: data.general.description,
          value: data.general.value,
          allocation: discount.rule.allocation,
        },
        metadata: getSubmittableMetadata(data.metadata),
      },
      {
        onSuccess: () => {
          notification(
            t("general-success", "Success"),
            t(
              "general-discount-updated-successfully",
              "Discount updated successfully"
            ),
            "success"
          )
          onClose()
        },
        onError: (error) => {
          notification(
            t("general-error", "Error"),
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
  })

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(discount))
    }
  }, [discount, reset, open])

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">
            {t("general-edit-general-information", "Edit general information")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="gap-y-xlarge flex flex-col">
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("general-details", "Details")}
                </h2>
                <DiscountGeneralForm
                  form={nestedForm(form, "general")}
                  type={discount.rule.type}
                  isEdit
                />
              </div>
              <div>
                <h2 className="inter-base-semibold mb-base">
                  {t("general-metadata", "Metadata")}
                </h2>
                <MetadataForm form={nestedForm(form, "metadata")} />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onClose}
              >
                {t("general-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={isLoading}
                loading={isLoading}
              >
                {t("general-save-and-close", "Save and close")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (discount: Discount): GeneralForm | undefined => {
  return {
    general: {
      code: discount.code,
      description: discount.rule.description,
      region_ids: discount.regions.map((r) => ({
        label: r.name,
        value: r.id,
        currency_code: r.currency_code,
      })),
      value: discount.rule.value,
    },
    metadata: getMetadataFormValues(discount.metadata),
  }
}

export default EditGeneral
