import { PencilSquare, Trash } from "@medusajs/icons"
import { Badge, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { useDeleteVariant } from "../../../../../hooks/api/products"
import { HttpTypes } from "@medusajs/types"

const VariantActions = ({
  variant,
  product,
}: {
  variant: HttpTypes.AdminProductVariant
  product: HttpTypes.AdminProduct
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

const columnHelper = createColumnHelper<HttpTypes.AdminProductVariant>()

export const useProductVariantTableColumns = (
  product?: HttpTypes.AdminProduct
) => {
  const { t } = useTranslation()

  const optionColumns = useMemo(() => {
    if (!product) {
      return []
    }
    return product.options?.map((option) => {
      return columnHelper.display({
        id: option.id,
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{option.title}</span>
          </div>
        ),
        cell: ({ row }) => {
          const variantOpt: any = row.original.options.find(
            (opt: any) => opt.option_id === option.id
          )
          if (!variantOpt) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex h-full w-full items-center overflow-hidden">
              <Badge
                size="2xsmall"
                className="flex min-w-[20px] items-center justify-center"
              >
                {variantOpt.value}
              </Badge>
            </div>
          )
        },
      })
    })
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
          const { product } = table.options.meta as {
            product: HttpTypes.AdminProduct
          }

          return <VariantActions variant={row.original} product={product} />
        },
      }),
    ],
    [t, optionColumns]
  )
}
