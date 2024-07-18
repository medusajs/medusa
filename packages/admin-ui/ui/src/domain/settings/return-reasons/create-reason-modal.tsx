import { ReturnReason } from "@medusajs/medusa"
import { useAdminCreateReturnReason } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import TextArea from "../../../components/molecules/textarea"
import useNotification from "../../../hooks/use-notification"
import FormValidator from "../../../utils/form-validator"

type CreateReturnReasonModalProps = {
  handleClose: () => void
  initialReason?: ReturnReason
}

type CreateReturnReasonFormData = {
  value: string
  label: string
  description: string | null
}

// the reason props is used for prefilling the form when duplicating
const CreateReturnReasonModal = ({
  handleClose,
  initialReason,
}: CreateReturnReasonModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReturnReasonFormData>({
    defaultValues: {
      value: initialReason?.value,
      label: initialReason?.label,
      description: initialReason?.description,
    },
  })
  const notification = useNotification()
  const { mutateAsync, isLoading } = useAdminCreateReturnReason()
  const { t } = useTranslation()

  const onCreate = async (data: CreateReturnReasonFormData) => {
    try {
      await mutateAsync({
        ...data,
        description: data.description || undefined,
      })
      notification(
        t("return-reasons-notification-success", "Success"),
        t(
          "return-reasons-created-a-new-return-reason",
          "Created a new return reason"
        ),
        t("return-reasons-success", "success")
      )
    } catch {
      notification(
        t("return-reasons-error", "Error"),
        t(
          "return-reasons-cannot-create-a-return-reason-with-an-existing-value",
          "Cannot create a return reason with an existing value"
        ),
        "error"
      )
    }
    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            {t("return-reasons-add-reason", "Add Reason")}
          </span>
        </Modal.Header>
        <form onSubmit={handleSubmit(onCreate)}>
          <Modal.Content>
            <div className="gap-large mb-large grid grid-cols-2">
              <Input
                {...register("value", {
                  required: t(
                    "return-reasons-value-is-required",
                    "Value is required"
                  ),
                  pattern: FormValidator.whiteSpaceRule("Value"),
                  minLength: FormValidator.minOneCharRule("Value"),
                })}
                label={t("return-reasons-value", "Value")}
                required
                placeholder="wrong_size"
                errors={errors}
              />
              <Input
                {...register("label", {
                  required: t(
                    "return-reasons-label-is-required",
                    "Label is required"
                  ),
                  pattern: FormValidator.whiteSpaceRule("Label"),
                  minLength: FormValidator.minOneCharRule("Label"),
                })}
                label={t("return-reasons-label", "Label")}
                required
                placeholder="Wrong size"
                errors={errors}
              />
            </div>
            <TextArea
              className="mt-large"
              rows={3}
              {...register("description")}
              label={t("return-reasons-description", "Description")}
              placeholder={t(
                "return-reasons-customer-received-the-wrong-size",
                "Customer received the wrong size"
              )}
              errors={errors}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-end">
              <Button
                variant="ghost"
                className="text-small me-2 w-32 justify-center"
                size="large"
                onClick={handleClose}
                type="button"
              >
                {t("return-reasons-cancel", "Cancel")}
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="text-small w-32 justify-center"
                variant="primary"
              >
                {t("return-reasons-create", "Create")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateReturnReasonModal
