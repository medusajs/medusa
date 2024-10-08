import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { useDeletePriceList } from "../../../../hooks/api/price-lists"

export const useDeletePriceListAction = ({
  priceList,
}: {
  priceList: HttpTypes.AdminPriceList
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeletePriceList(priceList.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("priceLists.delete.confirmation", {
        title: priceList.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(
          t("priceLists.delete.successToast", {
            title: priceList.title,
          })
        )

        navigate("/price-lists")
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  return handleDelete
}
