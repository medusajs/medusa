import { useNavigate } from "react-router-dom"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useDeleteProductOption } from "../../../../hooks/api"
import { HttpTypes } from "@medusajs/types"

export const useDeleteProductOptionAction = ({
  id,
  title,
}: HttpTypes.AdminProductOption) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteProductOption(id)

  return async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("productOptions.delete.confirmation", { title }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/product-options", {
          replace: true,
        })
        toast.success(t("productOptions.delete.successToast", { title }))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }
}
