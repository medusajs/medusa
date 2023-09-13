import { Product } from "@medusajs/medusa"
import { useAdminDeleteProduct, useAdminUpdateProduct } from "medusa-react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import PublishIcon from "../../fundamentals/icons/publish-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import { ActionType } from "../../molecules/actionables"
import useCopyProduct from "./use-copy-product"

const useProductActions = (product: Product) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const notification = useNotification()
  const dialog = useImperativeDialog()
  const copyProduct = useCopyProduct()
  const deleteProduct = useAdminDeleteProduct(product?.id)
  const updateProduct = useAdminUpdateProduct(product?.id)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: t("product-table-delete-product", "Delete Product"),
      text: t(
        "product-table-confirm-delete",
        "Are you sure you want to delete this product?"
      ),
    })

    if (shouldDelete) {
      deleteProduct.mutate()
    }
  }

  const getActions = (): ActionType[] => [
    {
      label: t("product-table-edit", "Edit"),
      onClick: () => navigate(`/a/products/${product.id}`),
      icon: <EditIcon size={20} />,
    },
    {
      label:
        product.status === "published"
          ? t("product-table-unpublish", "Unpublish")
          : t("product-table-publish", "Publish"),
      onClick: () => {
        const newStatus =
          product.status === "published"
            ? t("product-table-draft", "draft")
            : t("product-table-published", "published")
        updateProduct.mutate(
          {
            status: newStatus,
          },
          {
            onSuccess: () => {
              notification(
                t("product-table-success", "Success"),
                product.status === "published"
                  ? t(
                      "product-table-successfully-unpublished-product",
                      "Successfully unpublished product"
                    )
                  : t(
                      "product-table-successfully-published-product",
                      "Successfully published product"
                    ),
                "success"
              )
            },
            onError: (err) =>
              notification(
                t("product-table-error", "Error"),
                getErrorMessage(err),
                "error"
              ),
          }
        )
      },
      icon:
        product.status === "published" ? (
          <UnpublishIcon size={20} />
        ) : (
          <PublishIcon size={20} />
        ),
    },
    {
      label: t("product-table-duplicate", "Duplicate"),
      onClick: () => copyProduct(product),
      icon: <DuplicateIcon size={20} />,
    },
    {
      label: t("product-table-delete", "Delete"),
      variant: "danger",
      onClick: handleDelete,
      icon: <TrashIcon size={20} />,
    },
  ]

  return {
    getActions,
  }
}

export default useProductActions
