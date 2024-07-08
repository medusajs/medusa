import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDeleteProductCategory } from "../../../../hooks/api/categories"

export const useDeleteProductCategoryAction = (
  category: HttpTypes.AdminProductCategory
) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const { mutateAsync } = useDeleteProductCategory(category.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("categories.delete.confirmation", {
        name: category.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(t("general.success"), {
          description: t("categories.delete.successToast", {
            name: category.name,
          }),
        })

        navigate("/categories", {
          replace: true,
        })
      },
      onError: (e) => {
        toast.error(t("general.error"), {
          description: e.message,
        })
      },
    })
  }

  return handleDelete
}
