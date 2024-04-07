import { Currency, Product, ProductVariant, Region } from "@medusajs/medusa"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminPriceListProducts } from "medusa-react"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"

import { useTranslation } from "react-i18next"
import { Thumbnail } from "../../../../../components/common/thumbnail"
import { DataGrid } from "../../../../../components/grid/data-grid"
import { TextCell } from "../../../../../components/grid/grid-cells/common/text-cell"
import { DisplayCell } from "../../../../../components/grid/grid-cells/non-interactive/display-cell"
import { DataGridMeta } from "../../../../../components/grid/types"
import { RouteFocusModal } from "../../../../../components/route-modal"

type EditProductPricesFormProps = {
  regions: Region[]
  currencies: Currency[]
  ids: string | null
}

const ProductEditorSchema = z.object({
  products: z.record(
    z.object({
      variants: z.record(
        z.object({
          prices: z.object({
            regions: z.record(
              z.object({
                amount: z.number(),
              })
            ),
            currencies: z.record(
              z.object({
                amount: z.number(),
              })
            ),
          }),
        })
      ),
    })
  ),
})

type ProductEditorSchemaType = z.infer<typeof ProductEditorSchema>

export const EditProductPricesForm = ({
  ids,
  regions,
  currencies,
}: EditProductPricesFormProps) => {
  const { id } = useParams()

  const form = useForm()

  const { products, count, isLoading, isError, error } =
    useAdminPriceListProducts(
      id!,
      {
        id: ids?.split(",") || undefined,
      },
      {
        keepPreviousData: true,
      }
    )

  const columns = useColumns({ regions, currencies })

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <form className="flex size-full flex-col">
        <RouteFocusModal.Header></RouteFocusModal.Header>
        <RouteFocusModal.Body className="flex flex-col overflow-hidden">
          <DataGrid
            isLoading={isLoading}
            data={products as Product[]}
            columns={columns}
            state={form}
            getSubRows={getVariantRows}
          />
        </RouteFocusModal.Body>
      </form>
    </RouteFocusModal.Form>
  )
}

/**
 * Helper function to determine if a row is a product or a variant.
 */
const isProduct = (row: Product | ProductVariant): row is Product => {
  return "variants" in row
}

const getVariantRows = (row: Product | ProductVariant) => {
  if ("variants" in row) {
    return row.variants
  }

  return undefined
}

const columnHelper = createColumnHelper<Product | ProductVariant>()

const createRegionColum = (region: Region) => {
  return columnHelper.display({
    id: region.id,
    header: region.name,
    cell: ({ row, table }) => {
      const entity = row.original

      if (isProduct(entity)) {
        return <DisplayCell />
      }

      return (
        <TextCell
          field={`products.${entity.id}.variants.${entity.id}.prices.regions.${region.id}.amount`}
          meta={table.options.meta as DataGridMeta<ProductEditorSchemaType>}
        />
      )
    },
  })
}

const createCurrencyColumn = (currency: Currency) => {
  return columnHelper.display({
    id: currency.code,
    header: currency.code.toUpperCase(),
    cell: ({ row, table }) => {
      const entity = row.original

      if (isProduct(entity)) {
        return <DisplayCell />
      }

      return (
        <TextCell
          field={`products.${entity.id}.variants.${entity.id}.prices.currencies.${currency.code}.amount`}
          meta={table.options.meta as DataGridMeta<ProductEditorSchemaType>}
        />
      )
    },
  })
}

const useColumns = ({
  regions,
  currencies,
}: {
  regions: Region[]
  currencies: Currency[]
}) => {
  const { t } = useTranslation()

  const regionColumns = useMemo(() => {
    return regions.map(createRegionColum)
  }, [regions])

  const currencyColumns = useMemo(() => {
    return currencies.map(createCurrencyColumn)
  }, [currencies])

  return useMemo(
    () => [
      columnHelper.display({
        id: "product-display",
        header: t("fields.product"),
        cell: ({ row }) => {
          const entity = row.original

          if (isProduct(entity)) {
            return (
              <DisplayCell>
                <div className="flex h-full w-full items-center gap-x-2 overflow-hidden">
                  <Thumbnail src={entity.thumbnail} />
                  <span className="truncate">{entity.title}</span>
                </div>
              </DisplayCell>
            )
          }

          return (
            <DisplayCell>
              <div className="flex h-full w-full items-center overflow-hidden">
                <span className="truncate">{entity.title}</span>
              </div>
            </DisplayCell>
          )
        },
        size: 350,
      }),
      ...regionColumns,
      ...currencyColumns,
    ],
    [t, regionColumns, currencyColumns]
  )
}
