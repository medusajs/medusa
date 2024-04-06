import { PencilSquare, Trash } from "@medusajs/icons"
import { Product, ProductVariant } from "@medusajs/medusa"
import { Badge, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { useDeleteVariant } from "../../../../../hooks/api/products"

const VariantActions = ({
  variant,
  product,
}: {
  variant: ProductVariant
  product: Product
}) => {
  const { mutateAsync } = useDeleteVariant(product.id, variant.id)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("products.deleteVariantWarning", {
        title: variant.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              label: t("actions.edit"),
              to: `variants/${variant.id}/edit`,
              icon: <PencilSquare />,
            },
          ],
        },
        {
          actions: [
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<ProductVariant>()

export const useProductVariantTableColumns = (product?: Product) => {
  const { t } = useTranslation()

  const optionColumns = useMemo(() => {
    return product
      ? product.options?.map((o) => {
          return columnHelper.display({
            id: o.id,
            header: () => (
              <div className="flex h-full w-full items-center">
                <span className="truncate">{o.title}</span>
              </div>
            ),
            cell: ({ row }) => {
              const value = row.original.options.find(
                (op) => op.option_id === o.id
              )

              if (!value) {
                return <PlaceholderCell />
              }

              return (
                <div className="flex h-full w-full items-center overflow-hidden">
                  <Badge
                    size="2xsmall"
                    className="flex min-w-[20px] items-center justify-center"
                  >
                    {value.value}
                  </Badge>
                </div>
              )
            },
          })
        })
      : []
  }, [product])

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{t("fields.title")}</span>
          </div>
        ),
        cell: ({ getValue }) => (
          <div className="flex h-full w-full items-center overflow-hidden">
            <span className="truncate">{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("sku", {
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{t("fields.sku")}</span>
          </div>
        ),
        cell: ({ getValue }) => {
          const value = getValue()

          if (!value) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex h-full w-full items-center overflow-hidden">
              <span className="truncate">{value}</span>
            </div>
          )
        },
      }),
      ...optionColumns,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { product } = table.options.meta as { product: Product }

          return <VariantActions variant={row.original} product={product} />
        },
      }),
    ],
    [t, optionColumns]
  )
}
