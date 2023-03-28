import { Column, useTable } from "react-table"

import { ProductVariant } from "@medusajs/medusa"
import { useMemo, useState } from "react"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"
import BuildingsIcon from "../../fundamentals/icons/buildings-icon"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import Actionables from "../../molecules/actionables"
import Table from "../../molecules/table"
import DeletePrompt from "../delete-prompt"

type Props = {
  variants: ProductVariant[]
  actions: {
    deleteVariant: (variantId: string) => void
    duplicateVariant: (variant: ProductVariant) => void
    updateVariant: (variant: ProductVariant) => void
    updateVariantInventory: (variant: ProductVariant) => void
  }
}

export const useVariantsTableColumns = (inventoryIsEnabled = false) => {
  const columns = useMemo<Column<ProductVariant>[]>(() => {
    const quantityColumns = []
    if (!inventoryIsEnabled) {
      quantityColumns.push({
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
      })
    }
    return [
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
      ...quantityColumns,
    ]
  }, [inventoryIsEnabled])

  return columns
}

const VariantsTable = ({ variants, actions }: Props) => {
  const { isFeatureEnabled } = useFeatureFlag()
  const hasInventoryService = isFeatureEnabled("inventoryService")
  const columns = useVariantsTableColumns(hasInventoryService)
  const [showDelete, setShowDelete] = useState(false)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: variants,
      defaultColumn: {
        width: "auto",
      },
    })

  const {
    deleteVariant,
    updateVariant,
    duplicateVariant,
    updateVariantInventory,
  } = actions

  const getTableRowActionables = (variant: ProductVariant) => {
    const inventoryManagementActions = []
    if (hasInventoryService) {
      inventoryManagementActions.push({
        label: "Manage inventory",
        icon: <BuildingsIcon size="20" />,
        onClick: () => updateVariantInventory(variant),
      })
    }
    return [
      {
        label: "Edit Variant",
        icon: <EditIcon size="20" />,
        onClick: () => updateVariant(variant),
      },
      ...inventoryManagementActions,
      {
        label: "Duplicate Variant",
        onClick: () =>
          // @ts-ignore
          duplicateVariant({
            ...variant,
            title: variant.title + " Copy",
          }),
        icon: <DuplicateIcon size="20" />,
      },
      {
        label: "Delete Variant",
        onClick: () => setShowDelete(true),
        icon: <TrashIcon size="20" />,
        variant: "danger",
      },
    ]
  }

  return (
    <Table {...getTableProps()} className="table-fixed">
      <Table.Head>
        {headerGroups?.map((headerGroup) => {
          const { key, ...rest } = headerGroup.getHeaderGroupProps()
          return (
            <Table.HeadRow key={key} {...rest}>
              {headerGroup.headers.map((col) => {
                const { key, ...rest } = col.getHeaderProps()

                return (
                  <Table.HeadCell key={key} {...rest}>
                    {col.render("Header")}
                  </Table.HeadCell>
                )
              })}
            </Table.HeadRow>
          )
        })}
      </Table.Head>
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          const actionables = getTableRowActionables(row.original)
          const { key, ...rest } = row.getRowProps()
          return (
            <Table.Row color={"inherit"} key={key} {...rest}>
              {row.cells.map((cell) => {
                const { key, ...rest } = cell.getCellProps()
                return (
                  <Table.Cell key={key} {...rest}>
                    {cell.render("Cell")}
                  </Table.Cell>
                )
              })}
              <Table.Cell>
                <div className="float-right">
                  <Actionables forceDropdown actions={actionables} />
                  {showDelete && (
                    <DeletePrompt
                      onDelete={async () => deleteVariant(row.original.id)}
                      handleClose={() => setShowDelete(false)}
                      confirmText="Yes, delete"
                      heading="Delete variant"
                      text={`Are you sure you want to delete this variant? ${
                        isFeatureEnabled("inventoryService")
                          ? " Note: Deleting the variant will also remove inventory items and levels"
                          : ""
                      }`}
                      successText={false}
                    />
                  )}
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
