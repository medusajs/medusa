import { HttpTypes } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Thumbnail } from "../../../../components/common/thumbnail"
import { DataGrid } from "../../../../components/data-grid"
import { createDataGridPriceColumns } from "../../../../components/data-grid/data-grid-column-helpers/create-data-grid-price-columns"
import { createDataGridHelper } from "../../../../components/data-grid/utils"
import { isProductRow } from "../utils"

const columnHelper = createDataGridHelper<
  HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
>()

export const usePriceListGridColumns = ({
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  currencies?: HttpTypes.AdminStoreCurrency[]
  regions?: HttpTypes.AdminRegion[]
  pricePreferences?: HttpTypes.AdminPricePreference[]
}) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<
    HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
  >[] = useMemo(() => {
    return [
      columnHelper.column({
        id: t("fields.title"),
        header: t("fields.title"),
        cell: ({ row }) => {
          const entity = row.original
          if (isProductRow(entity)) {
            return (
              <DataGrid.ReadonlyCell>
                <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                  <Thumbnail src={entity.thumbnail} />
                  <span className="truncate">{entity.title}</span>
                </div>
              </DataGrid.ReadonlyCell>
            )
          }

          return (
            <DataGrid.ReadonlyCell>
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span className="truncate">{entity.title}</span>
              </div>
            </DataGrid.ReadonlyCell>
          )
        },
        disableHiding: true,
      }),
      ...createDataGridPriceColumns<
        HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
      >({
        currencies: currencies.map((c) => c.currency_code),
        regions,
        pricePreferences,
        isReadyOnly: (context) => {
          const entity = context.row.original
          return isProductRow(entity)
        },
        getFieldName: (context, value) => {
          const entity = context.row.original as any
          if (context.column.id.startsWith("currency_prices")) {
            return `products.${entity.product_id}.variants.${entity.id}.currency_prices.${value}.amount`
          }
          return `products.${entity.product_id}.variants.${entity.id}.region_prices.${value}.amount`
        },
        t,
      }),
    ]
  }, [t, currencies, regions, pricePreferences])

  return colDefs
}
