import { Column, useTable } from "react-table"

import { ProductVariant } from "@medusajs/medusa"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const columns = useMemo<Column<ProductVariant>[]>(() => {
    const quantityColumns = []
    if (!inventoryIsEnabled) {
      quantityColumns.push({
        Header: () => {
          return (
            <div className="text-end">
              <span>
                {t("product-variants-section-inventory", "Inventory")}
              </span>
            </div>
          )
        },
        id: "inventory",
        accessor: "inventory_quantity",
        maxWidth: 56,
        Cell: ({ cell }) => {
          return (
            <div className="text-end">
              <span>{cell.value}</span>
            </div>
          )
        },
      })
    }
    return [
      {
        Header: t("product-variants-section-title", "Title"),
        id: "title",
        accessor: "title",
      },
      {
        Header: t("product-variants-section-sku", "SKU"),
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
        Header: t("product-variants-section-ean", "EAN"),
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
  const { t } = useTranslation()
  const { isFeatureEnabled } = useFeatureFlag()
  const hasInventoryService = isFeatureEnabled("inventoryService")
  const columns = useVariantsTableColumns(hasInventoryService)
  const [variantToRemove, setVariantToRemove] = useState<ProductVariant | null>(
    null
  )

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
        label: t(
          "product-variants-section-manage-inventory",
          "Manage inventory"
        ),
        icon: <BuildingsIcon size="20" />,
        onClick: () => updateVariantInventory(variant),
      })
    }
    return [
      {
        label: t("product-variants-section-edit-variant", "Edit Variant"),
        icon: <EditIcon size="20" />,
        onClick: () => updateVariant(variant),
      },
      ...inventoryManagementActions,
      {
        label: t(
          "product-variants-section-duplicate-variant",
          "Duplicate Variant"
        ),
        onClick: () =>
          // @ts-ignore
          duplicateVariant({
            ...variant,
            title: variant.title + " Copy",
          }),
        icon: <DuplicateIcon size="20" />,
      },
      {
        label: t(
          "product-variants-section-delete-variant-label",
          "Delete Variant"
        ),
        onClick: () => setVariantToRemove(variant),
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
                  {variantToRemove && (
                    <DeletePrompt
                      onDelete={async () => deleteVariant(variantToRemove.id)}
                      handleClose={() => setVariantToRemove(null)}
                      confirmText={t(
                        "product-variants-section-yes-delete",
                        "Yes, delete"
                      )}
                      heading={t(
                        "product-variants-section-delete-variant-heading",
                        "Delete variant"
                      )}
                      text={`${t(
                        "product-variants-section-confirm-delete",
                        "Are you sure you want to delete this variant? "
                      )}${
                        isFeatureEnabled("inventoryService")
                          ? t(
                              "product-variants-section-note-deleting-the-variant-will-also-remove-inventory-items-and-levels",
                              " Note: Deleting the variant will also remove inventory items and levels"
                            )
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
