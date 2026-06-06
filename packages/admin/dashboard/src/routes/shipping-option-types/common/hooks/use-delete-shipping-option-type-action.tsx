import { useNavigate } from "react-router-dom"
import { toast, usePrompt } from "@zjedene-medusa/ui"
import { useTranslation } from "react-i18next"

import { useDeleteShippingOptionType } from "../../../../hooks/api/shipping-option-types"

export const useDeleteShippingOptionTypeAction = (
  id: string,
  label: string
) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteShippingOptionType(id)

  const handleDelete = async () => {
    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("shippingOptionTypes.delete.confirmation", { label }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        navigate("/settings/locations/shipping-option-types", {
          replace: true,
        })
        toast.success(t("shippingOptionTypes.delete.successToast", { label }))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return handleDelete
}
