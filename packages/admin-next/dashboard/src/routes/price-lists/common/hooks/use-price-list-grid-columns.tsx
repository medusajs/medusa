import { HttpTypes, StoreCurrencyDTO } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Thumbnail } from "../../../../components/common/thumbnail"
import { DataGridReadOnlyCell } from "../../../../components/data-grid/data-grid-cells/data-grid-readonly-cell"
import { createDataGridHelper } from "../../../../components/data-grid/utils"
import { isProductRow } from "../utils"
import { getPriceColumns } from "../../../../components/data-grid/data-grid-columns/price-columns"

const columnHelper = createDataGridHelper<
  HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
>()

export const usePriceListGridColumns = ({
  currencies = [],
  regions = [],
  pricePreferences = [],
}: {
  currencies?: StoreCurrencyDTO[]
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
              <DataGridReadOnlyCell>
                <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                  <Thumbnail src={entity.thumbnail} />
                  <span className="truncate">{entity.title}</span>
                </div>
              </DataGridReadOnlyCell>
            )
          }

          return (
            <DataGridReadOnlyCell>
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span className="truncate">{entity.title}</span>
              </div>
            </DataGridReadOnlyCell>
          )
        },
        disableHiding: true,
      }),
      ...getPriceColumns({
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
