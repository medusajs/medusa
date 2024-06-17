import { Buildings, Component, PencilSquare, Trash } from "@medusajs/icons"
import { Badge, usePrompt, clx } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { HttpTypes, InventoryItemDTO } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { useDeleteVariant } from "../../../../../hooks/api/products"

const VariantActions = ({
  variant,
  product,
}: {
  variant: HttpTypes.AdminProductVariant & {
    inventory_items: { inventory: InventoryItemDTO }[]
  }
  product: HttpTypes.AdminProduct
}) => {
  const { mutateAsync } = useDeleteVariant(product.id, variant.id)
  const { t } = useTranslation()
  const prompt = usePrompt()

  const inventoryItemsCount = variant.inventory_items?.length || 0
  const hasInventoryItem = inventoryItemsCount === 1
  const hasInventoryKit = inventoryItemsCount > 1

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

  const [inventoryItemLink, inventoryKitLink] = useMemo(() => {
    if (!variant.inventory_items?.length) {
      return ["", ""]
    }

    const itemId = variant.inventory_items![0].inventory.id
    const itemLink = `/inventory/${itemId}`

    const itemIds = variant.inventory_items!.map((i) => i.inventory.id)
    const params = { id: itemIds }
    const query = new URLSearchParams(params).toString()

    const kitLink = `/inventory?${query}`

    return [itemLink, kitLink]
  }, [variant.inventory_items])

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
            {
              label: t("actions.delete"),
              onClick: handleDelete,
              icon: <Trash />,
            },
            hasInventoryItem
              ? {
                  label: t("products.variant.inventory.actions.inventoryItems"),
                  to: inventoryItemLink,
                  icon: <Buildings />,
                }
              : false,
            hasInventoryKit
              ? {
                  label: t("products.variant.inventory.actions.inventoryKit"),
                  to: inventoryKitLink,
                  icon: <Component />,
                }
              : false,
          ].filter(Boolean),
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
      columnHelper.accessor("inventory_items", {
        header: () => (
          <div className="flex h-full w-full items-center">
            <span className="truncate">{t("fields.inventory")}</span>
          </div>
        ),
        cell: ({ getValue, row }) => {
          const variant = row.original

          if (!variant.manage_inventory) {
            return t("products.variant.inventory.notManaged")
          }

          const inventory: InventoryItemDTO[] = getValue().map(
            (i) => i.inventory
          )

          const hasInventoryKit = inventory.length > 1

          const locations = {}

          inventory.forEach((i) => {
            i.location_levels.forEach((l) => {
              locations[l.id] = true
            })
          })

          const locationCount = Object.keys(locations).length

          const text = hasInventoryKit
            ? t("products.variant.tableItemAvailable", {
                availableCount: variant.inventory_quantity,
              })
            : t("products.variant.tableItem", {
                availableCount: variant.inventory_quantity,
                locationCount,
                count: locationCount,
              })

          return (
            <div className="flex h-full w-full items-center gap-2 overflow-hidden">
              {hasInventoryKit && <Component style={{ marginTop: 1 }} />}
              <span
                className={clx("truncate", {
                  "text-ui-fg-error": !variant.inventory_quantity,
                })}
                title={text}
              >
                {text}
              </span>
            </div>
          )
        },
      }),
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
