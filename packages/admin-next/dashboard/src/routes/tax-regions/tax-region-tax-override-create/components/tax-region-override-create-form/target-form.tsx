import { Button, Checkbox } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { HttpTypes } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import {
  StackedDrawer,
  StackedFocusModal,
} from "../../../../../components/modals"
import { DataTable } from "../../../../../components/table/data-table"
import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"
import { useProducts } from "../../../../../hooks/api/products"
import { useCustomerGroupTableColumns } from "../../../../../hooks/table/columns/use-customer-group-table-columns"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useCustomerGroupTableFilters } from "../../../../../hooks/table/filters/use-customer-group-table-filters"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useCustomerGroupTableQuery } from "../../../../../hooks/table/query/use-customer-group-table-query"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { RuleReferenceType } from "../../../common/constants"
import { Reference } from "../../../common/schemas"

type TargetFormProps = {
  referenceType: RuleReferenceType
  type: "focus" | "drawer"
  state: Reference[]
  setState: (state: Reference[]) => void
}

function initRowSelection(state: Reference[]) {
  return state.reduce((acc, reference) => {
    acc[reference.value] = true
    return acc
  }, {} as RowSelectionState)
}

export const TargetForm = ({
  referenceType,
  type,
  setState,
  state,
}: TargetFormProps) => {
  const { t } = useTranslation()
  const Component = type === "focus" ? StackedFocusModal : StackedDrawer

  const [intermediate, setIntermediate] = useState<Reference[]>(state)

  const handleSave = () => {
    setState(intermediate)
  }

  return (
    <div className="flex size-full flex-col overflow-hidden">
      <Component.Body className="min-h-0 p-0">
        <Table
          referenceType={referenceType}
          initialRowState={initRowSelection(state)}
          intermediate={intermediate}
          setIntermediate={setIntermediate}
        />
      </Component.Body>
      <Component.Footer>
        <Component.Close asChild>
          <Button variant="secondary" size="small" type="button">
            {t("actions.cancel")}
          </Button>
        </Component.Close>
        <Button type="button" size="small" onClick={handleSave}>
          {t("actions.save")}
        </Button>
      </Component.Footer>
    </div>
  )
}

type TableProps = {
  referenceType: RuleReferenceType
  initialRowState: RowSelectionState
  intermediate: Reference[]
  setIntermediate: (state: Reference[]) => void
}

const Table = ({ referenceType, ...props }: TableProps) => {
  switch (referenceType) {
    case RuleReferenceType.CUSTOMER_GROUP:
      return <CustomerGroupTable {...props} />
    case RuleReferenceType.PRODUCT:
      return <ProductTable {...props} />
    // case RuleReferenceType.PRODUCT_COLLECTION:
    //   return <ProductCollectionTable {...props} />
    // case RuleReferenceType.PRODUCT_TYPE:
    //   return <ProductTypeTable {...props} />
    // case RuleReferenceType.PRODUCT_TAG:
    //   return <ProductTagTable {...props} />
    default:
      return null
  }
}

type TableImplementationProps = {
  initialRowState: RowSelectionState
  intermediate: Reference[]
  setIntermediate: (state: Reference[]) => void
}

const PAGE_SIZE = 50

const PREFIX_CUSTOMER_GROUP = "cg"

const CustomerGroupTable = ({
  initialRowState,
  intermediate,
  setIntermediate,
}: TableImplementationProps) => {
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialRowState)

  const { searchParams, raw } = useCustomerGroupTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX_CUSTOMER_GROUP,
  })
  const { customer_groups, count, isLoading, isError, error } =
    useCustomerGroups(searchParams, {
      placeholderData: keepPreviousData,
    })

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newCustomerGroups =
      customer_groups
        ?.filter((cg) => newIds.includes(cg.id))
        .map((cg) => ({ value: cg.id, label: cg.name! })) || []

    const filteredIntermediate = intermediate.filter(
      (cg) => !removedIds.includes(cg.value)
    )

    setIntermediate([...filteredIntermediate, ...newCustomerGroups])
    setRowSelection(state)
  }

  const filters = useCustomerGroupTableFilters()
  const columns = useGroupColumns()

  const { table } = useDataTable({
    data: customer_groups || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX_CUSTOMER_GROUP,
  })

  if (isError) {
    throw error
  }

  return (
    <DataTable
      table={table}
      columns={columns}
      pageSize={PAGE_SIZE}
      count={count}
      isLoading={isLoading}
      filters={filters}
      orderBy={["name", "created_at", "updated_at"]}
      layout="fill"
      pagination
      search
      prefix={PREFIX_CUSTOMER_GROUP}
      queryObject={raw}
    />
  )
}

const cgColumnHelper = createColumnHelper<HttpTypes.AdminCustomerGroup>()

const useGroupColumns = () => {
  const base = useCustomerGroupTableColumns()

  return useMemo(
    () => [
      cgColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}

const PREFIX_PRODUCT = "p"

const ProductTable = ({
  initialRowState,
  intermediate,
  setIntermediate,
}: TableImplementationProps) => {
  const [rowSelection, setRowSelection] =
    useState<RowSelectionState>(initialRowState)

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT,
  })

  const { products, count, isLoading, isError, error } = useProducts(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (value) => {
    const state = typeof value === "function" ? value(rowSelection) : value
    const currentIds = Object.keys(rowSelection)

    const ids = Object.keys(state)

    const newIds = ids.filter((id) => !currentIds.includes(id))
    const removedIds = currentIds.filter((id) => !ids.includes(id))

    const newProducts =
      products
        ?.filter((p) => newIds.includes(p.id))
        .map((p) => ({
          value: p.id,
          label: p.title!,
        })) || []

    const filteredIntermediate = intermediate.filter(
      (p) => !removedIds.includes(p.value)
    )

    setIntermediate([...filteredIntermediate, ...newProducts])
    setRowSelection(state)
  }

  const filters = useProductTableFilters()
  const columns = useProductColumns()

  const { table } = useDataTable({
    data: products || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: true,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
    prefix: PREFIX_PRODUCT,
  })

  if (isError) {
    throw error
  }

  return (
    <DataTable
      table={table}
      columns={columns}
      pageSize={PAGE_SIZE}
      count={count}
      isLoading={isLoading}
      filters={filters}
      orderBy={["title", "created_at", "updated_at"]}
      layout="fill"
      pagination
      search
      prefix={PREFIX_PRODUCT}
      queryObject={raw}
    />
  )
}

const pColumnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useProductColumns = () => {
  const base = useProductTableColumns()

  return useMemo(
    () => [
      pColumnHelper.display({
        id: "select",
        header: ({ table }) => {
          return (
            <Checkbox
              checked={
                table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}

// const PREFIX_PRODUCT_COLLECTION = "pc"

// const ProductCollectionTable = ({
//   initialRowState,
// }: TableImplementationProps) => {
//   const [rowSelection, setRowSelection] =
//     useState<RowSelectionState>(initialRowState)
// }

// const pcColumnHelper = createColumnHelper<HttpTypes.AdminCollection>()

// const useProductCollectionColumns = () => {
//   const base = useProductCollectionConditionsTableColumns()

//   return useMemo(
//     () => [
//       pcColumnHelper.display({
//         id: "select",
//         header: ({ table }) => {
//           return (
//             <Checkbox
//               checked={
//                 table.getIsSomePageRowsSelected()
//                   ? "indeterminate"
//                   : table.getIsAllPageRowsSelected()
//               }
//               onCheckedChange={(value) =>
//                 table.toggleAllPageRowsSelected(!!value)
//               }
//             />
//           )
//         },
//         cell: ({ row }) => {
//           return (
//             <Checkbox
//               checked={row.getIsSelected()}
//               onCheckedChange={(value) => row.toggleSelected(!!value)}
//               onClick={(e) => {
//                 e.stopPropagation()
//               }}
//             />
//           )
//         },
//       }),
//       ...base,
//     ],
//     [base]
//   )
// }

// const PREFIX_PRODUCT_TYPE = "pt"

// const ProductTypeTable = ({ initialRowState }: TableImplementationProps) => {
//   const [rowSelection, setRowSelection] =
//     useState<RowSelectionState>(initialRowState)
// }

// const ptColumnHelper = createColumnHelper<HttpTypes.AdminProductType>()

// const useProductTypeColumns = () => {
//   const base = useProductTableColumns()

//   return useMemo(
//     () => [
//       ptColumnHelper.display({
//         id: "select",
//         header: ({ table }) => {
//           return (
//             <Checkbox
//               checked={
//                 table.getIsSomePageRowsSelected()
//                   ? "indeterminate"
//                   : table.getIsAllPageRowsSelected()
//               }
//               onCheckedChange={(value) =>
//                 table.toggleAllPageRowsSelected(!!value)
//               }
//             />
//           )
//         },
//         cell: ({ row }) => {
//           return (
//             <Checkbox
//               checked={row.getIsSelected()}
//               onCheckedChange={(value) => row.toggleSelected(!!value)}
//               onClick={(e) => {
//                 e.stopPropagation()
//               }}
//             />
//           )
//         },
//       }),
//       ...base,
//     ],
//     [base]
//   )
// }

// const PREFIX_PRODUCT_TAG = "ptag"

// const ProductTagTable = ({ initialRowState }: TableImplementationProps) => {
//   const [rowSelection, setRowSelection] =
//     useState<RowSelectionState>(initialRowState)
// }

// const ptagColumnHelper = createColumnHelper<HttpTypes.AdminProductTag>()

// const useProductTagColumns = () => {
//   const base = useProductTableColumns()

//   return useMemo(
//     () => [
//       ptagColumnHelper.display({
//         id: "select",
//         header: ({ table }) => {
//           return (
//             <Checkbox
//               checked={
//                 table.getIsSomePageRowsSelected()
//                   ? "indeterminate"
//                   : table.getIsAllPageRowsSelected()
//               }
//               onCheckedChange={(value) =>
//                 table.toggleAllPageRowsSelected(!!value)
//               }
//             />
//           )
//         },
//         cell: ({ row }) => {
//           return (
//             <Checkbox
//               checked={row.getIsSelected()}
//               onCheckedChange={(value) => row.toggleSelected(!!value)}
//               onClick={(e) => {
//                 e.stopPropagation()
//               }}
//             />
//           )
//         },
//       }),
//       ...base,
//     ],
//     [base]
//   )
// }
