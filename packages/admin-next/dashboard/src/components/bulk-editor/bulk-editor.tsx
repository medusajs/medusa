import { Currency, Product, ProductVariant, Region } from "@medusajs/medusa"
import { Button, Container, clx } from "@medusajs/ui"
import {
  CellContext,
  ColumnDef,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useAdminProducts, useAdminRegions, useAdminStore } from "medusa-react"
import { useMemo, useRef } from "react"
import * as zod from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { UseFormRegister, useForm } from "react-hook-form"
import { Thumbnail } from "../common/thumbnail"

const schema = zod.object({
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

export const ProductEditor = () => {
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

  return <DataGrid data={products as Product[]} columns={columns} />
}

export const DataGrid = ({
  data,
  columns,
}: {
  data: (Product | ProductVariant)[]
  columns: ColumnDef<Product | ProductVariant>[]
}) => {
  // prettier-ignore
  const form = useForm<zod.infer<typeof schema>>({
    defaultValues: {
      products: (data as Product[]).reduce(
        (products, product) => {
          products[product.id] = {
            variants: product.variants.reduce((variants, variant) => {
              variants[variant.id] = {
                sku: variant.sku ?? "",
              }
              return variants
            }, {} as zod.infer<typeof schema>["products"]["id"]["variants"]),
          }

          return products
        },
        {} as zod.infer<typeof schema>["products"]
      ),
    },
    resolver: zodResolver(schema),
  })

  const handleSubmit = form.handleSubmit((data) => {
    console.log(JSON.stringify(data, null, 2))
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data: data,
    columns,
    getSubRows: (row) => {
      if (isProduct(row)) {
        return row.variants
      }
      return undefined
    },
    getCoreRowModel: getCoreRowModel(),
    meta: {
      register: form.register,
      updateData: (key: keyof zod.infer<typeof schema>, value: any) =>
        form.setValue(key, value),
    },
  })

  const { flatRows } = table.getRowModel()
  const isNestedGrid = flatRows.some((r) => r.depth > 0)

  const rowVirtualizer = useVirtualizer({
    count: flatRows.length,
    estimateSize: () => 40, // Row heigh is fixed at 40px
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <Container className="overflow-hidden p-0">
      <div className="border-b p-4"></div>
      <div
        ref={tableContainerRef}
        style={{
          overflow: "auto",
          position: "relative",
          height: "600px",
        }}
      >
        <table className="text-ui-fg-subtle grid">
          <thead className="txt-compact-small-plus bg-ui-bg-subtle sticky top-0 z-[1] grid">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex h-10 w-full">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        width: header.getSize(),
                      }}
                      className="bg-ui-bg-base flex items-center border-b border-r px-4 py-2.5"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              display: "grid",
              height: `${rowVirtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = flatRows[virtualRow.index] as Row<
                Product | ProductVariant
              >

              const isGroupHeader = isNestedGrid && row.depth === 0

              return (
                <tr
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="bg-ui-bg-subtle txt-compact-small absolute flex h-10 w-full"
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                        }}
                        className={clx(
                          "bg-ui-bg-base flex items-center border-b border-r px-4 py-2.5",
                          {
                            "bg-ui-bg-subtle": isGroupHeader,
                          }
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  )
}

type Meta = {
  updateData: (rowIndex: number, columnId: string, value: unknown) => void
  register: UseFormRegister<{
    products: Record<
      string,
      {
        variants: Record<
          string,
          {
            sku: string
          }
        >
      }
    >
  }>
}

const isProduct = (row: Product | ProductVariant): row is Product => {
  return "variants" in row
}

const NumberCell = <TData, TValue>({
  getValue,
  row: { index, original },
  column: { id },
  table,
}: CellContext<TData, TValue>) => {
  //   const initialValue = getValue()
  //   // We need to keep and update the state of the cell normally
  //   const [value, setValue] = useState(initialValue)

  //   console.log(index, id)

  const { register } = table.options.meta as Meta

  //   // When the input is blurred, we'll call our table meta's updateData function
  //   const onBlur = () => {
  //     updateData(index, id, value)
  //   }

  //   // If the initialValue is changed external, sync it up with our state
  //   useEffect(() => {
  //     setValue(initialValue)
  //   }, [initialValue])

  const key = `products.${original.product_id}.variants.${original.id}.sku`

  return <input className="w-full" {...register(key)} />
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

          if (!isProduct(entity)) {
            const price = entity.prices.find((p) => p.region_id === region.id)
            return price?.amount
          }

          return null
        },
      })
    })

    return [
      columnHelper.display({
        id: "title",
        header: "Product",
        cell: ({ row }) => {
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
        cell: (cell) => {
          const entity = cell.row.original

          if (isProduct(entity)) {
            return null
          }

          return <NumberCell {...cell} />
        },
      }),
      ...regionColumns,
    ]
  }, [regions, currencies])

  return colDefs
}
