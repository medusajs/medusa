import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDeleteProductOptionValue } from "../../../../hooks/api"

export const useDeleteProductOptionValueAction = (
  optionId: string,
  { id, value }: HttpTypes.AdminProductOptionValue,
  { redirectOnSuccess }: { redirectOnSuccess?: boolean } = {}
) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteProductOptionValue(optionId, id)

  return async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("productOptions.values.delete.confirmation", { value }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("productOptions.values.delete.successToast"))

        if (redirectOnSuccess) {
          navigate(`/product-options/${optionId}`, { replace: true })
        }
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }
}
