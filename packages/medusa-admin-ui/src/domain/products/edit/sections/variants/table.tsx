import { ProductVariant } from "@medusajs/medusa"
import React, { useMemo } from "react"
import { Column, useTable } from "react-table"
import DuplicateIcon from "../../../../../components/fundamentals/icons/duplicate-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import Actionables from "../../../../../components/molecules/actionables"
import Table from "../../../../../components/molecules/table"

type Props = {
  variants: ProductVariant[]
  actions: {
    deleteVariant: (variantId: string) => void
    duplicateVariant: (variant: ProductVariant) => void
    updateVariant: (variant: ProductVariant) => void
  }
}

export const useVariantsTableColumns = () => {
  const columns = useMemo<Column<ProductVariant>[]>(
    () => [
      {
        Header: "Title",
        id: "title",
        accessor: "title",
      },
      {
        Header: "SKU",
        id: "sku",
        accessor: "sku",
        maxWidth: 264,
        Cell: ({ cell }) => {
          return cell.value ? (
            cell.value
          ) : (
            <span className="text-grey-50">-</span>
          )
        },
      },
      {
        Header: "EAN",
        id: "ean",
        accessor: "ean",
        maxWidth: 264,
        Cell: ({ cell }) => {
          return cell.value ? (
            cell.value
          ) : (
            <span className="text-grey-50">-</span>
          )
        },
      },
      {
        Header: () => {
          return (
            <div className="text-right">
              <span>Inventory</span>
            </div>
          )
        },
        id: "inventory",
        accessor: "inventory_quantity",
        maxWidth: 56,
        Cell: ({ cell }) => {
          return (
            <div className="text-right">
              <span>{cell.value}</span>
            </div>
          )
        },
      },
    ],
    []
  )

  return columns
}

const VariantsTable = ({ variants, actions }: Props) => {
  const columns = useVariantsTableColumns()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: variants,
    defaultColumn: {
      width: "auto",
    },
  })

  const { deleteVariant, updateVariant, duplicateVariant } = actions

  return (
    <Table {...getTableProps()} className="table-fixed">
      <Table.Head>
        {headerGroups?.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => (
              <Table.HeadCell {...col.getHeaderProps()}>
                {col.render("Header")}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        ))}
      </Table.Head>
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <Table.Row color={"inherit"} {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <Table.Cell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </Table.Cell>
                )
              })}
              <Table.Cell>
                <div className="float-right">
                  <Actionables
                    forceDropdown
                    actions={[
                      {
                        label: "Edit Variant",
                        icon: <EditIcon size="20" />,
                        onClick: () => updateVariant(row.original),
                      },
                      {
                        label: "Duplicate Variant",
                        onClick: () =>
                          // @ts-ignore
                          duplicateVariant({
                            ...row.original,
                            title: row.original.title + " Copy",
                          }),
                        icon: <DuplicateIcon size="20" />,
                      },
                      {
                        label: "Delete Variant",
                        onClick: () => deleteVariant(row.original.id),
                        icon: <TrashIcon size="20" />,
                        variant: "danger",
                      },
                    ]}
                  />
                </div>
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default VariantsTable
