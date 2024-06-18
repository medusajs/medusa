import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDeleteProductType } from "../../../../hooks/api/product-types"

export const useDeleteProductTypeAction = (id: string) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteProductType(id)

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("productTypes.delete.confirmation"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("productTypes.delete.successToast"),
          dismissLabel: t("actions.close"),
          dismissable: true,
        })
      },
      onError: (e) => {
        toast.error(t("general.error"), {
          description: e.message,
          dismissLabel: t("actions.close"),
          dismissable: true,
        })
      },
    })
  }

  return handleDelete
}
