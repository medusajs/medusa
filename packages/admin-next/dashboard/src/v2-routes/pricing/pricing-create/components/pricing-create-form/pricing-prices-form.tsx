import { ProductVariantDTO } from "@medusajs/types"
import { Button, DropdownMenu } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { DataGrid } from "../../../../../components/grid/data-grid"
import { CurrencyCell } from "../../../../../components/grid/grid-cells/common/currency-cell"
import { DisplayField } from "../../../../../components/grid/grid-cells/non-interactive/display-field"
import { DataGridMeta } from "../../../../../components/grid/types"
import { useProducts } from "../../../../../hooks/api/products"
import { useStore } from "../../../../../hooks/api/store"
import { ExtendedProductDTO } from "../../../../../types/api-responses"
import { PricingCreateSchemaType, PricingVariantsRecordType } from "./schema"

type PricingPricesFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

enum ColumnType {
  REGION = "region",
  CURRENCY = "currency",
}

type EnabledColumnRecord = Record<string, ColumnType>

export const PricingPricesForm = ({ form }: PricingPricesFormProps) => {
  const {
    store,
    isLoading: isLoadingStore,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const [enabledColumns, setEnabledColumns] = useState<EnabledColumnRecord>({})

  useEffect(() => {
    if (
      store?.default_currency_code &&
      Object.keys(enabledColumns).length === 0
    ) {
      setEnabledColumns({
        ...enabledColumns,
        [store.default_currency_code]: ColumnType.CURRENCY,
      })
    }
  }, [store, enabledColumns])

  const ids = useWatch({
    control: form.control,
    name: "product_ids",
  })
  const existingProducts = useWatch({
    control: form.control,
    name: "products",
  })

  const { products, isLoading, isError, error } = useProducts({
    id: ids,
    limit: ids.length,
    fields: "title,thumbnail,*variants",
  })

  const { setValue } = form

  useEffect(() => {
    if (!isLoading && products) {
      products.forEach((product) => {
        /**
         * If the product already exists in the form, we don't want to overwrite it.
         */
        if (existingProducts[product.id]) {
          return
        }

        setValue(`products.${product.id}.variants`, {
          ...product.variants.reduce((variants, variant) => {
            variants[variant.id] = {
              currency_prices: {},
              region_prices: {},
            }
            return variants
          }, {} as PricingVariantsRecordType),
        })
      })
    }
  }, [products, existingProducts, isLoading, setValue])

  const toggleColumn = ({ type, id }: { type: ColumnType; id: string }) => {
    setEnabledColumns((prev) => {
      if (prev[id]) {
        const { [id]: _, ...rest } = prev

        return {
          ...rest,
        }
      }

      return {
        ...prev,
        [id]: type,
      }
    })
  }

  const columns = useColumns(enabledColumns)

  const initializing = isLoading || !products

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <div className="p-4">
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="secondary" size="small">
              Currency
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {store?.supported_currency_codes.map((currency) => {
              const checked =
                currency === store.default_currency_code ||
                !!enabledColumns[currency]

              return (
                <DropdownMenu.CheckboxItem
                  onSelect={(e) => e.preventDefault()}
                  checked={checked}
                  disabled={currency === store.default_currency_code}
                  key={currency}
                  onClick={() =>
                    toggleColumn({ type: ColumnType.CURRENCY, id: currency })
                  }
                >
                  {currency.toUpperCase()}
                </DropdownMenu.CheckboxItem>
              )
            })}
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <DataGrid
        columns={columns}
        data={products}
        getSubRows={(row) => {
          if (isProduct(row)) {
            return row.variants
          }
        }}
        isLoading={initializing}
        state={form}
      />
    </div>
  )
}

/**
 * Helper function to determine if a row is a product or a variant.
 */
const isProduct = (
  row: ExtendedProductDTO | ProductVariantDTO
): row is ExtendedProductDTO => {
  return "variants" in row
}

const columnHelper = createColumnHelper<
  ExtendedProductDTO | ProductVariantDTO
>()

const useColumns = (enabledColumns: EnabledColumnRecord) => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<ExtendedProductDTO | ProductVariantDTO>[] =
    useMemo(() => {
      return [
        columnHelper.display({
          id: t("fields.title"),
          header: "Title",
          cell: ({ row }) => {
            const entity = row.original

            if (isProduct(entity)) {
              return (
                <DisplayField>
                  <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                    <Thumbnail src={entity.thumbnail} />
                    <span className="truncate">{entity.title}</span>
                  </div>
                </DisplayField>
              )
            }

            return (
              <DisplayField>
                <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                  <span className="truncate">{entity.title}</span>
                </div>
              </DisplayField>
            )
          },
        }),
        ...Object.entries(enabledColumns).map(([id, type]) => {
          return columnHelper.display({
            header: `Price ${id.toUpperCase()}`,
            cell: ({ row, table }) => {
              const entity = row.original

              if (isProduct(entity)) {
                return <DisplayField />
              }

              return (
                <CurrencyCell
                  code={id}
                  meta={
                    table.options.meta as DataGridMeta<PricingCreateSchemaType>
                  }
                  field={`products.${entity.product_id}.variants.${entity.id}.currency_prices.${id}`}
                />
              )
            },
          })
        }),
      ]
    }, [t, enabledColumns])

  return colDefs
}
