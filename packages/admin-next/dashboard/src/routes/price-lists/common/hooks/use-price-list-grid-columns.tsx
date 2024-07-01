import { HttpTypes, StoreCurrencyDTO } from "@medusajs/types"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Thumbnail } from "../../../../components/common/thumbnail"
import { DataGridCurrencyCell } from "../../../../components/data-grid/data-grid-cells/data-grid-currency-cell"
import { DataGridReadOnlyCell } from "../../../../components/data-grid/data-grid-cells/data-grid-readonly-cell"
import { createDataGridHelper } from "../../../../components/data-grid/utils"
import { isProductRow } from "../utils"

const columnHelper = createDataGridHelper<
  HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
>()

export const usePriceListGridColumns = ({
  currencies = [],
  regions = [],
}: {
  currencies?: StoreCurrencyDTO[]
  regions?: HttpTypes.AdminRegion[]
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
      ...currencies.map((currency) => {
        return columnHelper.column({
          id: `currency-price-${currency.currency_code}`,
          name: `Price ${currency.currency_code.toUpperCase()}`,
          header: `Price ${currency.currency_code.toUpperCase()}`,
          cell: (context) => {
            const entity = context.row.original

            if (isProductRow(entity)) {
              return <DataGridReadOnlyCell />
            }

            return (
              <DataGridCurrencyCell
                context={context}
                code={currency.currency_code}
                field={`products.${entity.product_id}.variants.${entity.id}.currency_prices.${currency.currency_code}.amount`}
              />
            )
          },
        })
      }),
      ...regions.map((region) => {
        return columnHelper.column({
          id: `region-price-${region.id}`,
          name: `Price ${region.name}`,
          header: `Price ${region.name}`,
          cell: (context) => {
            const entity = context.row.original

            if (isProductRow(entity)) {
              return <DataGridReadOnlyCell />
            }

            return (
              <DataGridCurrencyCell
                context={context}
                code={region.currency_code}
                field={`products.${entity.product_id}.variants.${entity.id}.region_prices.${region.id}.amount`}
              />
            )
          },
        })
      }),
    ]
  }, [t, currencies, regions])

  return colDefs
}
