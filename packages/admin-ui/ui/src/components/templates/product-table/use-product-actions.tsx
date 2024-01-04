import {
  adminInventoryItemsKeys,
  useAdminDeleteProduct,
  useAdminUpdateProduct,
  useMedusa,
} from "medusa-react"

import { ActionType } from "../../molecules/actionables"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import { Product } from "@medusajs/medusa"
import PublishIcon from "../../fundamentals/icons/publish-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import { getErrorMessage } from "../../../utils/error-messages"
import useCopyProduct from "./use-copy-product"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import { useNavigate } from "react-router-dom"
import useNotification from "../../../hooks/use-notification"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

const useProductActions = (product: Product) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const notification = useNotification()
  const dialog = useImperativeDialog()
  const copyProduct = useCopyProduct()
  const deleteProduct = useAdminDeleteProduct(product?.id)
  const updateProduct = useAdminUpdateProduct(product?.id)
  const queryClient = useQueryClient()
  const { isFeatureEnabled } = useFeatureFlag()
  const { client } = useMedusa()

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: t("product-table-delete-product", "Delete Product"),
      text: t(
        "product-table-confirm-delete",
        "Are you sure you want to delete this product?"
      ),
    })

    if (shouldDelete) {
      if (isFeatureEnabled("inventoryService")) {
        const { variants } = await client.admin.variants.list({
          id: product.variants.map((v) => v.id),
          expand: "inventory_items",
        })

        variants
          .filter(({ inventory_items }) => !!inventory_items?.length)
          .map(({ inventory_items }) =>
            client.admin.inventoryItems.delete(
              inventory_items![0].inventory_item_id
            )
          )
        queryClient.invalidateQueries(adminInventoryItemsKeys.lists())
      }

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
        const newStatus = product.status === "published" ? "draft" : "published"
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
