import { Discount } from "@medusajs/medusa"
import { useAdminUpdateDiscount } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import DiscountConfigurationForm, {
  DiscountConfigurationFormType,
} from "../../../../components/forms/discount/discount-configuration-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"

type EditConfigurationsProps = {
  discount: Discount
  onClose: () => void
  open: boolean
}

type ConfigurationsForm = {
  config: DiscountConfigurationFormType
}

const EditConfigurations: React.FC<EditConfigurationsProps> = ({
  discount,
  onClose,
  open,
}) => {
  const { t } = useTranslation()

  const { mutate, isLoading } = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const form = useForm<ConfigurationsForm>({
    defaultValues: getDefaultValues(discount),
  })

  const { handleSubmit, reset } = form

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        starts_at: data.config.starts_at ?? new Date(),
        ends_at: data.config.ends_at,
        usage_limit:
          data.config.usage_limit && data.config.usage_limit > 0
            ? data.config.usage_limit
            : null,
        valid_duration: data.config.valid_duration,
      },
      {
        onSuccess: ({ discount }) => {
          notification(
            t("configurations-success", "Success"),
            t(
              "configurations-discount-updated-successfully",
              "Discount updated successfully"
            ),
            "success"
          )
          reset(getDefaultValues(discount))
          onClose()
        },
        onError: (error) => {
          notification(
            t("configurations-error", "Error"),
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
    <Modal open={open} handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">
            {t("configurations-edit-configurations", "Edit configurations")}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <DiscountConfigurationForm form={nestedForm(form, "config")} />
          </Modal.Content>
          <Modal.Footer>
            <div className="gap-x-xsmall flex w-full items-center justify-end">
              <Button
                variant="ghost"
                size="small"
                className="min-w-[128px]"
                type="button"
                onClick={onClose}
              >
                {t("configurations-cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                size="small"
                className="min-w-[128px]"
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                {t("configurations-save", "Save")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (discount: Discount): ConfigurationsForm => {
  return {
    config: {
      starts_at: new Date(discount.starts_at),
      ends_at: discount.ends_at ? new Date(discount.ends_at) : null,
      usage_limit: discount.usage_limit,
      valid_duration: discount.valid_duration,
    },
  }
}

export default EditConfigurations
