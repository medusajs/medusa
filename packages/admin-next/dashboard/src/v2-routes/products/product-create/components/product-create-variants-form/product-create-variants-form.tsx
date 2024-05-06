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
      columnHelper.display({
        id: "sku",
        header: "SKU",
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.sku`}
            />
          )
        },
        enableHiding: true,
      }),
      columnHelper.display({
        id: "ean",
        header: "EAN",
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.ean`}
            />
          )
        },
        enableHiding: true,
      }),
      columnHelper.display({
        id: "upc",
        header: "UPC",
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.upc`}
            />
          )
        },
        enableHiding: true,
      }),
      columnHelper.display({
        id: "barcode",
        header: "Barcode",
        cell: (context) => {
          return (
            <DataGridTextCell
              context={context}
              field={`variants.${context.row.index}.barcode`}
            />
          )
        },
        enableHiding: true,
      }),
    ],
    [options]
  )
}
