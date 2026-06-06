import { useNavigate } from "react-router-dom"
import { toast, usePrompt } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"

import { useDeleteProductType } from "../../../../hooks/api/product-types"

export const useDeleteProductTypeAction = (id: string, value: string) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteProductType(id)

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("productTypes.delete.confirmation", { value }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/settings/product-types", { replace: true })
        toast.success(t("productTypes.delete.successToast", { value }))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return handleDelete
}
