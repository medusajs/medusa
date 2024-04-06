import { zodResolver } from "@hookform/resolvers/zod"
import { Product, ProductVariant } from "@medusajs/medusa"
import { Button, Container } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useAdminProducts } from "medusa-react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Thumbnail } from "../common/thumbnail"
import { DataGrid } from "./data-grid"
import { TextField } from "./grid-cells/common/text-field"
import { DisplayField } from "./grid-cells/non-interactive/display-field"
import { DataGridMeta } from "./types"

const ProductEditorSchema = zod.object({
  products: zod.record(
    zod.object({
      variants: zod.record(
        zod.object({
          title: zod.string(),
          sku: zod.string(),
          ean: zod.string().optional(),
          upc: zod.string().optional(),
        })
      ),
    })
  ),
})

type ProductEditorSchemaType = zod.infer<typeof ProductEditorSchema>
type VariantObject = ProductEditorSchemaType["products"]["id"]["variants"]

const getVariantRows = (row: Product | ProductVariant) => {
  if ("variants" in row) {
    return row.variants
  }

  return undefined
}

/**
 * Demo component to test the data grid.
 *
 * To be deleted when the feature is implemented.
 */
export const DataGridDemo = () => {
  const form = useForm<ProductEditorSchemaType>({
    resolver: zodResolver(ProductEditorSchema),
  })

  const { setValue } = form

  const { products, isLoading } = useAdminProducts(
    {
      expand: "variants,variants.prices",
    },
    {
      keepPreviousData: true,
    }
  )

  useEffect(() => {
    if (!isLoading && products) {
      products.forEach((product) => {
        setValue(`products.${product.id}.variants`, {
          ...product.variants.reduce((variants, variant) => {
            variants[variant.id!] = {
              title: variant.title || "",
              sku: variant.sku || "",
              ean: variant.ean || "",
              upc: variant.upc || "",
            }
            return variants
          }, {} as VariantObject),
        })
      })
    }
  }, [products, isLoading, setValue])

  const columns = useColumns()

  const initializing = isLoading || !products

  const handleSubmit = form.handleSubmit((data) => {
    console.log("submitting", data)
  })

  return (
    <Container className="overflow-hidden p-0">
      <DataGrid
        isLoading={initializing}
        data={products as Product[]}
        columns={columns}
        state={form}
        getSubRows={getVariantRows}
      />
      <div className="flex items-center justify-end gap-x-2 border-t p-4">
        <Button size="small" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Container>
  )
}

/**
 * Helper function to determine if a row is a product or a variant.
 */
const isProduct = (row: Product | ProductVariant): row is Product => {
  return "variants" in row
}

const columnHelper = createColumnHelper<Product | ProductVariant>()

const useColumns = () => {
  const { t } = useTranslation()

  const colDefs: ColumnDef<Product | ProductVariant>[] = useMemo(() => {
    return [
      columnHelper.display({
        id: t("fields.title"),
        header: "Title",
        cell: ({ row, table }) => {
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
            <TextField
              meta={table.options.meta as DataGridMeta<ProductEditorSchemaType>}
              field={`products.${entity.product_id}.variants.${entity.id}.title`}
            />
          )
        },
        size: 350,
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
              meta={table.options.meta as DataGridMeta<ProductEditorSchemaType>}
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
              meta={table.options.meta as DataGridMeta<ProductEditorSchemaType>}
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
              meta={table.options.meta as DataGridMeta<ProductEditorSchemaType>}
              field={`products.${entity.product_id}.variants.${entity.id}.upc`}
            />
          )
        },
      }),
    ]
  }, [t])

  return colDefs
}
