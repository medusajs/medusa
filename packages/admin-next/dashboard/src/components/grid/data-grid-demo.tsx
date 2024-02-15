import { Currency, Product, ProductVariant, Region } from "@medusajs/medusa"
import { ColumnDef, Table, createColumnHelper } from "@tanstack/react-table"
import { useAdminProducts, useAdminRegions, useAdminStore } from "medusa-react"
import { useMemo } from "react"
import { DefaultValues, UseFormRegister } from "react-hook-form"
import * as zod from "zod"
import { Thumbnail } from "../common/thumbnail"
import { DataGrid } from "./data-grid"

const ProductEditorSchema = zod.object({
  products: zod.record(
    zod.object({
      variants: zod.record(
        zod.object({
          sku: zod.string(),
        })
      ),
    })
  ),
})

type ProductEditorSchemaType = zod.infer<typeof ProductEditorSchema>
type ProductObject = ProductEditorSchemaType["products"]
type VariantObject = ProductEditorSchemaType["products"]["id"]["variants"]

const productFormatter = (
  data: (Product | ProductVariant)[]
): DefaultValues<ProductEditorSchemaType> => {
  return (data as Product[]).reduce((products, product) => {
    products[product.id] = {
      variants: product.variants.reduce((variants, variant) => {
        variants[variant.id] = {
          sku: variant.sku ?? "",
        }
        return variants
      }, {} as VariantObject),
    }

    return products
  }, {} as ProductObject)
}

const getVariantRows = (row: Product | ProductVariant) => {
  if ("variants" in row) {
    return row.variants
  }

  return undefined
}

export const DataGridDemo = () => {
  const { products, isLoading } = useAdminProducts(
    {
      expand: "variants,variants.prices",
    },
    {
      keepPreviousData: true,
    }
  )

  const { regions, isLoading: isLoadingRegions } = useAdminRegions({
    limit: 9999,
    fields: "id,name,currency_code",
  })
  const { store, isLoading: isLoadingStore } = useAdminStore()

  const columns = useColumns(regions, store?.currencies)

  if (isLoading || !products) {
    return <div>Loading...</div>
  }

  return (
    <DataGrid
      data={products as Product[]}
      columns={columns}
      schema={ProductEditorSchema}
      formatter={productFormatter}
      getSubRows={getVariantRows}
    />
  )
}

type Meta = {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
  register: UseFormRegister<any>
}

const isProduct = (row: Product | ProductVariant): row is Product => {
  return "variants" in row
}

/**
 * A hidden input that can be rendered in cell that should not be editable in the current context.
 *
 */
const DisabledInput = () => {
  return (
    <input
      type="checkbox"
      disabled
      hidden
      data-role="presentation"
      role="presentation"
      aria-hidden
    />
  )
}

const TextInput = <TData,>({
  field,
  table,
}: {
  table: Table<TData>
  field: string
}) => {
  const { register } = table.options.meta as Meta

  return (
    <input
      className="w-full"
      data-input-field="true"
      data-field-id={field}
      {...register(field)}
    />
  )
}

const columnHelper = createColumnHelper<Product | ProductVariant>()

const useColumns = (regions?: Region[], currencies?: Currency[]) => {
  const colDefs: ColumnDef<Product | ProductVariant>[] = useMemo(() => {
    if (!regions || !currencies) {
      return []
    }

    const regionColumns = regions.map((region) => {
      return columnHelper.display({
        id: `region-${region.id}`,
        header: () => region.name,
        cell: ({ row }) => {
          const entity = row.original

          if (isProduct(entity)) {
            return <DisabledInput />
          }

          const price = entity.prices.find((p) => p.region_id === region.id)
          return price?.amount
        },
      })
    })

    return [
      columnHelper.display({
        id: "title",
        header: "Title",
        cell: ({ row, table }) => {
          const entity = row.original

          if (isProduct(entity)) {
            return (
              <div className="flex items-center gap-x-2 overflow-hidden">
                <Thumbnail src={entity.thumbnail} />
                <span className="truncate">{entity.title}</span>
              </div>
            )
          }

          const { title, sku } = entity
          const display = [title, sku].filter(Boolean).join("  ·  ")

          return display
        },
      }),
      columnHelper.accessor("sku", {
        header: "SKU",
        cell: ({ row, table }) => {
          const entity = row.original

          if (isProduct(entity)) {
            return <DisabledInput />
          }

          return (
            <TextInput
              table={table}
              field={`products.${entity.product_id}.variants.${entity.id}.sku`}
            />
          )
        },
      }),
      ...regionColumns,
    ]
  }, [regions, currencies])

  return colDefs
}
