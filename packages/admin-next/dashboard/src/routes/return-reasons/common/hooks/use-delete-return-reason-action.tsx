import { AdminReturnReason } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDeleteProductType } from "../../../../hooks/api/product-types"

export const useDeleteReturnReasonAction = ({
  id,
  label,
}: AdminReturnReason) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteProductType(id)

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("returnReasons.delete.confirmation", {
        value: label,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("productTypes.delete.successToast"))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return handleDelete
}
