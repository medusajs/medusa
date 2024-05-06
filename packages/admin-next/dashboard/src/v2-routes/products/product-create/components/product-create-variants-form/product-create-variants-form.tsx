import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"

import { DataGridReadOnlyCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-readonly-cell"
import { DataGridTextCell } from "../../../../../components/data-grid/data-grid-cells/data-grid-text-cell"
import { DataGridRoot } from "../../../../../components/data-grid/data-grid-root"
import { CreateProductOptionSchemaType } from "../../../common/types"
import {
  ProductCreateSchemaType,
  ProductCreateVariantSchemaType,
} from "../../types"

type ProductCreateVariantsFormProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateVariantsForm = ({
  form,
}: ProductCreateVariantsFormProps) => {
  const variants = useWatch({
    control: form.control,
    name: "variants",
    defaultValue: [],
  })

  const options = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  })

  const columns = useColumns({ options })

  return (
    <div className="flex size-full flex-col divide-y overflow-hidden">
      <DataGridRoot columns={columns} data={variants} state={form} />
    </div>
  )
}

const columnHelper = createColumnHelper<ProductCreateVariantSchemaType>()

const useColumns = ({
  options,
}: {
  options: CreateProductOptionSchemaType[]
}) => {
  return useMemo(
    () => [
      ...options.map((option) => {
        return columnHelper.display({
          id: `opt-${option.title}`,
          header: option.title,
          cell: ({ row }) => {
            const value = row.original.options[option.title]

            return <DataGridReadOnlyCell>{value}</DataGridReadOnlyCell>
          },
          enableHiding: false,
        })
      }),
      columnHelper.display({
        id: "title",
        header: "Title",
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.title`}
            />
          )
        },
        enableHiding: true,
      }),
      //   columnHelper.display({
      //     id: "sku",
      //     header: "SKU",
      //     cell: (info) => {
      //       const { row, table, column } =
      //         info as GridCellContext<ProductCreateVariantSchemaType>

      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.sku`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "ean",
      //     header: "EAN",
      //     cell: (info) => {
      //       const { row, table, column } =
      //         info as GridCellContext<ProductCreateVariantSchemaType>

      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.ean`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "upc",
      //     header: "UPC",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.upc`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "barcode",
      //     header: "Barcode",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.barcode`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "hs_code",
      //     header: "HS Code",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.hs_code`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "mid_code",
      //     header: "MID Code",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.mid_code`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "inventory_quantity",
      //     header: "Inventory Quantity",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.inventory_quantity`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "allow_backorder",
      //     header: "Allow Backorder",
      //     cell: (info) => {
      //       const { row, table, column } =
      //         info as GridCellContext<ProductCreateVariantSchemaType>

      //       return (
      //         <BooleanCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.allow_backorder`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "manage_inventory",
      //     header: "Manage Inventory",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <BooleanCell
      //           column={column.id}
      //           row={row.index}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.manage_inventory`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "weight",
      //     header: "Weight",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.weight`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "length",
      //     header: "Length",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.length`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "height",
      //     header: "Height",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.height`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "width",
      //     header: "Width",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.width`}
      //         />
      //       )
      //     },
      //   }),
      //   columnHelper.display({
      //     id: "origin_country",
      //     header: "Country of Origin",
      //     cell: ({ row, table, column }) => {
      //       return (
      //         <TextCell
      //           row={row.index}
      //           column={column.id}
      //           meta={table.options.meta as DataGridMeta}
      //           field={`variants.${row.index}.origin_country`}
      //         />
      //       )
      //     },
      //   }),
    ],
    [options]
  )
}
