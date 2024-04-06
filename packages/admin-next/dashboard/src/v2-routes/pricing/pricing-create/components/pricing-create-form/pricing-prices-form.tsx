import { ProductVariantDTO } from "@medusajs/types"
import { Button, DropdownMenu } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useEffect, useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { DataGrid } from "../../../../../components/grid/data-grid"
import { TextField } from "../../../../../components/grid/grid-fields/common/text-field"
import { DisplayField } from "../../../../../components/grid/grid-fields/non-interactive/display-field"
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

export const PricingPricesForm = ({ form }: PricingPricesFormProps) => {
  const ids = useWatch({
    control: form.control,
    name: "product_ids",
  })

  const {
    store,
    isLoading: isLoadingStore,
    isError: isStoreError,
    error: storeError,
  } = useStore()

  const { products, isLoading, isError, error } = useProducts({
    id: ids,
    limit: ids.length,
    fields: "title,thumbnail,*variants",
  })

  const { setValue } = form

  useEffect(() => {
    if (!isLoading && products) {
      products.forEach((product) => {
        setValue(`products.${product.id}.variants`, {
          ...product.variants.reduce((variants, variant) => {
            variants[variant.id] = {
              title: variant.title || "",
            }
            return variants
          }, {} as PricingVariantsRecordType),
        })
      })
    }
  }, [products, isLoading, setValue])

  const toggleColumn = ({ type, id }: { type: ColumnType; id: string }) => {
    console.log(type, id)
  }

  const columns = useColumns()

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
            {store?.supported_currency_codes.map((currency) => (
              <DropdownMenu.CheckboxItem
                checked={currency === store.default_currency_code}
                disabled={currency === store.default_currency_code}
                key={currency}
                onClick={() =>
                  toggleColumn({ type: ColumnType.CURRENCY, id: currency })
                }
              >
                {currency.toUpperCase()}
              </DropdownMenu.CheckboxItem>
            ))}
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

const useColumns = () => {
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
        columnHelper.accessor("sku", {
          header: t("fields.sku"),
          cell: ({ row, table }) => {
            const entity = row.original

            if (isProduct(entity)) {
              return <DisplayField />
            }

            return (
              <TextField
                meta={
                  table.options.meta as DataGridMeta<PricingCreateSchemaType>
                }
                field={`products.${entity.product_id}.variants.${entity.id}.sku`}
              />
            )
          },
        }),
        columnHelper.accessor("ean", {
          header: "EAN",
          cell: ({ row, table }) => {
            const entity = row.original

            if (isProduct(entity)) {
              return <DisplayField />
            }

            return (
              <TextField
                meta={
                  table.options.meta as DataGridMeta<PricingCreateSchemaType>
                }
                field={`products.${entity.product_id}.variants.${entity.id}.ean`}
              />
            )
          },
        }),
        columnHelper.accessor("upc", {
          header: "UPC",
          cell: ({ row, table }) => {
            const entity = row.original

            if (isProduct(entity)) {
              return <DisplayField />
            }

            return (
              <TextField
                meta={
                  table.options.meta as DataGridMeta<PricingCreateSchemaType>
                }
                field={`products.${entity.product_id}.variants.${entity.id}.upc`}
              />
            )
          },
        }),
      ]
    }, [t])

  return colDefs
}
