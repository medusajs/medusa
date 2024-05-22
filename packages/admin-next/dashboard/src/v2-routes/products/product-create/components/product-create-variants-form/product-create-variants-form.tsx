import { CurrencyDTO, ProductVariantDTO } from "@medusajs/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ProductCreateSchemaType } from "../../types"
import { useStore } from "../../../../../hooks/api/store"
import { useCurrencies } from "../../../../../hooks/api/currencies"
import { DataGrid } from "../../../../../components/grid/data-grid"
import { ReadonlyCell } from "../../../../../components/grid/grid-cells/common/readonly-cell"
import { CurrencyCell } from "../../../../../components/grid/grid-cells/common/currency-cell"
import { DataGridMeta } from "../../../../../components/grid/types"
import { TextCell } from "../../../../../components/grid/grid-cells/common/text-cell"
import { BooleanCell } from "../../../../../components/grid/grid-cells/common/boolean-cell"

type ProductCreateVariantsFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateVariantsForm = ({
  form,
}: ProductCreateVariantsFormProps) => {
  const { store, isLoading: isStoreLoading } = useStore()
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies(
    {
      code: store?.supported_currency_codes,
      limit: store?.supported_currency_codes?.length,
    },
    {
      enabled: !!store,
    }
  )

  const columns = useVariantPriceGridColumns({
    currencies,
  })

  const variants = useWatch({
    control: form.control,
    name: "variants",
  }) as any

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGrid
        columns={columns}
        data={variants}
        isLoading={isStoreLoading || isCurrenciesLoading}
        state={form}
      />
    </div>
  )
}

const columnHelper = createColumnHelper<ProductVariantDTO>()

export const useVariantPriceGridColumns = ({
  currencies = [],
}: {
  currencies?: CurrencyDTO[]
}) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<ProductVariantDTO>[] = useMemo(() => {
    return [
      columnHelper.display({
        id: t("fields.title"),
        header: t("fields.title"),
        cell: ({ row }) => {
          const entity = row.original

          return (
            <ReadonlyCell>
              <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                <span className="truncate">{entity.title}</span>
              </div>
            </ReadonlyCell>
          )
        },
      }),
      columnHelper.display({
        id: t("fields.customTitle"),
        header: t("fields.customTitle"),
        cell: ({ row, table }) => {
          return (
            <TextCell
              meta={table.options.meta as DataGridMeta}
              field={`variants.${row.index}.custom_title`}
              placeholder={t("fields.title")}
            />
          )
        },
      }),
      columnHelper.display({
        id: t("fields.sku"),
        header: t("fields.sku"),
        cell: ({ row, table }) => {
          return (
            <TextCell
              meta={table.options.meta as DataGridMeta}
              field={`variants.${row.index}.sku`}
              placeholder="SKU-123"
            />
          )
        },
      }),
      columnHelper.display({
        id: t("fields.manageInventory"),
        header: t("fields.manageInventory"),
        cell: ({ row, table }) => {
          return (
            <BooleanCell
              meta={table.options.meta as DataGridMeta}
              field={`variants.${row.index}.manage_inventory`}
            />
          )
        },
      }),
      columnHelper.display({
        id: t("fields.allowBackorder"),
        header: t("fields.allowBackorder"),
        cell: ({ row, table }) => {
          return (
            <BooleanCell
              meta={table.options.meta as DataGridMeta}
              field={`variants.${row.index}.allow_backorder`}
            />
          )
        },
      }),
      columnHelper.display({
        id: t("fields.inventoryKit"),
        header: t("fields.inventoryKit"),
        cell: ({ row, table }) => {
          return (
            <BooleanCell
              meta={table.options.meta as DataGridMeta}
              field={`variants.${row.index}.inventory_kit`}
            />
          )
        },
      }),
      ...currencies.map((currency) => {
        return columnHelper.display({
          header: `Price ${currency.code.toUpperCase()}`,
          cell: ({ row, table }) => {
            return (
              <CurrencyCell
                currency={currency}
                meta={table.options.meta as DataGridMeta}
                field={`variants.${row.index}.prices.${currency.code}`}
              />
            )
          },
        })
      }),
    ]
  }, [t, currencies])

  return colDefs
}
