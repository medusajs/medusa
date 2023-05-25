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
            t("Success"),
            t("Successfully updated return reason"),
            "success"
          )
        },
        onError: (error) => {
          notification(t("Error"), getErrorMessage(error), "error")
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
            label: t("Duplicate reason"),
            icon: <DuplicateIcon size={20} />,
            onClick: () => handleOpenDuplicateModal(),
          },
          {
            label: t("Delete reason"),
            variant: "danger",
            icon: <TrashIcon size={20} />,
            onClick: () => handleOpenPrompt(),
          },
        ]}
        events={[
          {
            label: t("Save"),
            onClick: handleSubmit(onSave),
          },
          {
            label: t("Cancel"),
            onClick: handleCancel,
          },
        ]}
        title={t("Details")}
        subtitle={reason?.value}
      >
        <form onSubmit={handleSubmit(onSave)}>
          <Input {...register("label")} label={t("Label")} />
          <Input
            {...register("description")}
            label={t("Description")}
            className="mt-base"
            placeholder={t("Customer received the wrong size")}
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
          heading={t("Delete Return Reason")}
          text={t("Are you sure you want to delete this return reason?")}
          handleClose={handleClosePrompt}
          onDelete={handleDeletion}
        />
      )}
    </>
  )
}

export default ReturnReasonDetail
