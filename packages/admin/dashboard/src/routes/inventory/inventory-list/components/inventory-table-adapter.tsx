import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { useInventoryItems } from "../../../../hooks/api/inventory"
import {
  createTableAdapter,
  TableAdapter,
} from "../../../../lib/table/table-adapters"
import { INVENTORY_ITEM_IDS_KEY } from "../../common/constants"
import { InventoryActions } from "./inventory-actions"

export function createInventoryTableAdapter({
  t,
  navigate,
}: {
  t: TFunction<"translation", undefined>
  navigate: NavigateFunction
}): TableAdapter<HttpTypes.AdminInventoryItem> {
  return createTableAdapter<HttpTypes.AdminInventoryItem>({
    entity: "inventory-items",
    queryPrefix: "inv",
    pageSize: 20,
    emptyState: {
      empty: {
        heading: t("general.noRecordsMessage"),
      },
      filtered: {
        heading: t("general.noRecordsMessage"),
        description: t("general.noRecordsMessageFiltered"),
      },
    },
    enableRowSelection: true,
    commands: [
      {
        label: t("inventory.stock.action"),
        shortcut: "i",
        action: (selection) => {
          navigate(
            `stock?${INVENTORY_ITEM_IDS_KEY}=${Object.keys(selection).join(
              ","
            )}`
          )
        },
      },
    ],
    useData: (fields, params) => {
      const { inventory_items, count, isError, error, isPending } =
        useInventoryItems({
          fields,
          ...params,
        })
      return {
        data: inventory_items,
        count,
        isLoading: isPending,
        isError,
        error,
      }
    },
    getRowHref: (row) => `/inventory/${row.id}`,
    renderRowActions: (row) => <InventoryActions item={row} />,
    transformColumns: (columns) => {
      const ALLOWED_FILTERS = [
        "id",
        "sku",
        "origin_country",
        "mid_code",
        "hs_code",
        "material",
        "requires_shipping",
        "weight",
        "length",
        "height",
        "width",
        "location",
      ]

      return columns.map((column) => {
        const isFilterDisabled = !ALLOWED_FILTERS.includes(column.field)

        return {
          ...column,
          filter: isFilterDisabled
            ? { ...column.filter, enabled: false }
            : column.filter,
        }
      })
    },
  })
}

// eslint-disable-next-line max-len
export function useInventoryTableAdapter(): TableAdapter<HttpTypes.AdminInventoryItem> {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return useMemo(
    () => createInventoryTableAdapter({ t, navigate }),
    [t, navigate]
  )
}
