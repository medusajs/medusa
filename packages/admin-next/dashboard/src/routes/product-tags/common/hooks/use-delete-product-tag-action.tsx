import { HttpTypes } from "@medusajs/types"
import { toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDeleteProductTag } from "../../../../hooks/api"

type UseDeleteProductTagActionProps = {
  productTag: HttpTypes.AdminProductTag
}

export const useDeleteProductTagAction = ({
  productTag,
}: UseDeleteProductTagActionProps) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const navigate = useNavigate()

  const { mutateAsync } = useDeleteProductTag(productTag.id)

  const handleDelete = async () => {
    const confirmed = await prompt({
      title: t("general.areYouSure"),
      description: t("productTags.delete.confirmation", {
        value: productTag.value,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirmed) {
      return
    }

    await mutateAsync(undefined, {
      onSuccess: () => {
        toast.success(
          t("productTags.delete.successToast", {
            value: productTag.value,
          })
        )
        navigate("/settings/product-tags", {
          replace: true,
        })
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return handleDelete
}
