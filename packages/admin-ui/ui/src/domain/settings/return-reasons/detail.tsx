import { ReturnReason } from "@medusajs/medusa"
import {
  useAdminDeleteReturnReason,
  useAdminUpdateReturnReason,
} from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import DuplicateIcon from "../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Input from "../../../components/molecules/input"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useNotification from "../../../hooks/use-notification"
import useToggleState from "../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../utils/error-messages"
import CreateReturnReasonModal from "./create-reason-modal"

type ReturnReasonDetailsProps = {
  reason: ReturnReason
}

type ReturnReasonDetailsFormData = {
  label: string
  description: string | null
}

const ReturnReasonDetail = ({ reason }: ReturnReasonDetailsProps) => {
  const {
    state: showDuplicateModal,
    open: handleOpenDuplicateModal,
    close: handleCloseDuplicateModal,
  } = useToggleState()
  const {
    state: showDanger,
    open: handleOpenPrompt,
    close: handleClosePrompt,
  } = useToggleState()
  const { register, reset, handleSubmit } =
    useForm<ReturnReasonDetailsFormData>()
  const notification = useNotification()
  const { t } = useTranslation()
  const { mutate: deleteRR } = useAdminDeleteReturnReason(reason?.id)
  const { mutate: update } = useAdminUpdateReturnReason(reason?.id)

  const handleDeletion = async () => {
    deleteRR(undefined)
  }

  const onSave = (data: ReturnReasonDetailsFormData) => {
    update(
      {
        label: data.label,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          notification(
            t("return-reasons-success-title", "Success"),
            t(
              "return-reasons-successfully-updated-return-reason",
              "Successfully updated return reason"
            ),
            "success"
          )
        },
        onError: (error) => {
          notification(
            t("return-reasons-error", "Error"),
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
  }

  const handleCancel = () => {
    reset({
      label: reason.label,
      description: reason.description,
    })
  }

  useEffect(() => {
    if (reason) {
      reset({
        label: reason.label,
        description: reason.description,
      })
    }
  }, [reason])

  return (
    <>
      <BodyCard
        actionables={[
          {
            label: t("return-reasons-duplicate-reason", "Duplicate reason"),
            icon: <DuplicateIcon size={20} />,
            onClick: () => handleOpenDuplicateModal(),
          },
          {
            label: t("return-reasons-delete-reason", "Delete reason"),
            variant: "danger",
            icon: <TrashIcon size={20} />,
            onClick: () => handleOpenPrompt(),
          },
        ]}
        events={[
          {
            label: t("return-reasons-save", "Save"),
            onClick: handleSubmit(onSave),
          },
          {
            label: t("return-reasons-cancel", "Cancel"),
            onClick: handleCancel,
          },
        ]}
        title={t("return-reasons-details", "Details")}
        subtitle={reason?.value}
      >
        <form onSubmit={handleSubmit(onSave)}>
          <Input
            {...register("label")}
            label={t("return-reasons-label", "Label")}
          />
          <Input
            {...register("description")}
            label={t("return-reasons-description", "Description")}
            className="mt-base"
            placeholder={t(
              "return-reasons-customer-received-the-wrong-size",
              "Customer received the wrong size"
            )}
          />
        </form>
      </BodyCard>
      {showDuplicateModal && (
        <CreateReturnReasonModal
          initialReason={reason}
          handleClose={handleCloseDuplicateModal}
        />
      )}
      {showDanger && (
        <DeletePrompt
          heading={t(
            "return-reasons-delete-return-reason",
            "Delete Return Reason"
          )}
          text={t(
            "return-reasons-are-you-sure-you-want-to-delete-this-return-reason",
            "Are you sure you want to delete this return reason?"
          )}
          handleClose={handleClosePrompt}
          onDelete={handleDeletion}
        />
      )}
    </>
  )
}

export default ReturnReasonDetail
