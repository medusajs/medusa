import { AdminReturnReason } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDeleteReturnReason } from "../../../../hooks/api/return-reasons"

export const useDeleteReturnReasonAction = ({
  id,
  label,
}: AdminReturnReason) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteReturnReason(id)

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("returnReasons.delete.confirmation", {
        label,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("returnReasons.delete.successToast", { label }))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return handleDelete
}
