import { CurrencyDTO, HttpTypes } from "@medusajs/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Thumbnail } from "../../../../components/common/thumbnail"
import { CurrencyCell } from "../../../../components/grid/grid-cells/common/currency-cell"
import { ReadonlyCell } from "../../../../components/grid/grid-cells/common/readonly-cell"
import { VoidCell } from "../../../../components/grid/grid-cells/common/void-cell"
import { DataGridMeta } from "../../../../components/grid/types"
import { isProductRow } from "../utils"

const columnHelper = createColumnHelper<
  HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
>()

export const usePriceListGridColumns = ({
  currencies = [],
}: {
  currencies?: CurrencyDTO[]
}) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<
    HttpTypes.AdminProduct | HttpTypes.AdminProductVariant
  >[] = useMemo(() => {
    return [
      columnHelper.display({
        id: t("fields.title"),
        header: t("fields.title"),
        cell: ({ row }) => {
          const entity = row.original

          if (isProductRow(entity)) {
            return (
              <VoidCell>
                <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                  <Thumbnail src={entity.thumbnail} />
                  <span className="truncate">{entity.title}</span>
                </div>
              </VoidCell>
            )
          }

          return (
            <ReadonlyCell>
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span className="truncate">{entity.title}</span>
              </div>
            </ReadonlyCell>
          )
        },
      }),
      ...currencies.map((currency) => {
        return columnHelper.display({
          header: `Price ${currency.code.toUpperCase()}`,
          cell: ({ row, table }) => {
            const entity = row.original

            if (isProductRow(entity)) {
              return <VoidCell />
            }

            return (
              <CurrencyCell
                currency={currency}
                meta={table.options.meta as DataGridMeta}
                field={`products.${entity.product_id}.variants.${entity.id}.currency_prices.${currency.code}.amount`}
              />
            )
          },
        })
      }),
    ]
  }, [t, currencies])

  return colDefs
}
