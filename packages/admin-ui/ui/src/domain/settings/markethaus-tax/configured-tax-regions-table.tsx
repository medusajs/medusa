import { FC, useMemo, useState } from "react"
import { Column, Row, usePagination, useTable } from "react-table"
import { ConfiguredTaxRegion } from "@medusajs/medusa"
import clsx from "clsx"

import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Table from "../../../components/molecules/table"
import moment from "moment"
import Tooltip from "../../../components/atoms/tooltip"
import {
  useAdminGetConfiguredTaxRegions,
  useAdminGetTaxRegions,
} from "../../../hooks/admin/tax-regions/queries"
import { ActionType } from "../../../components/molecules/actionables"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import Button from "../../../components/fundamentals/button"
import { CreateConfiguredTaxRegionModal } from "./create-configured-tax-region-modal"
import { UpdateConfiguredTaxRegionModal } from "./update-configured-tax-region-modal"

export interface ConfiguredTaxRegionsTableProps {}

export interface ConfiguredTaxRegionRowProps {
  row: Row<ConfiguredTaxRegion>
  className?: string
}

const ConfiguredTaxRegionRow: FC<ConfiguredTaxRegionRowProps> = ({
  row,
  className,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleDeleteClick = () => setConfirmDelete(true)
  const handleEditClick = () => setEditModalOpen(true)

  const actions = [
    {
      label: "Edit",
      onClick: handleEditClick,
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: handleDeleteClick,
      icon: <TrashIcon size={20} />,
      variant: "danger" as ActionType["variant"],
    },
  ]

  return (
    <>
      <Table.Row
        {...row.getRowProps()}
        color="inherit"
        className={clsx("group", className)}
        actions={actions}
      >
        {row.cells.map((cell, index) =>
          cell.render("Cell", { key: cell.column.id, index })
        )}
      </Table.Row>

      {confirmDelete && (
        <DeletePrompt
          onDelete={async () => {
            console.log("delete")
          }}
          handleClose={() => setConfirmDelete(false)}
        />
      )}

      {editModalOpen && (
        <UpdateConfiguredTaxRegionModal
          configured_tax_region={row.original}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </>
  )
}

const useConfiguredTaxRegionColumns: () => Column<ConfiguredTaxRegion>[] = () =>
  useMemo<Column<ConfiguredTaxRegion>[]>(
    () => [
      {
        Header: "Region",
        accessor: (row) => row.tax_region.province_name,
        Cell: ({ cell: { value }, row: { index, original } }) => (
          <Table.Cell key={index} className="">
            <div className="flex items-center gap-2">
              <div className="truncate pr-4">{value}</div>
            </div>
          </Table.Cell>
        ),
      },
      {
        Header: "Registered Tax ID",
        accessor: (row) => row.registered_tax_id,
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="">
            <div className="truncate">{value || "(not setup)"}</div>
          </Table.Cell>
        ),
      },
      {
        Header: <div className="px-4">Last updated</div>,
        accessor: "updated_at",
        Cell: ({ cell: { value }, row: { index } }) => (
          <Table.Cell key={index} className="px-4">
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </Table.Cell>
        ),
      },
      {
        Header: "",
        id: "settings-col",
      },
    ],
    []
  )

const ConfiguredTaxRegionsTable: FC<ConfiguredTaxRegionsTableProps> = () => {
  const { tax_regions } = useAdminGetTaxRegions()
  const { configured_tax_regions } = useAdminGetConfiguredTaxRegions()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const columns = useConfiguredTaxRegionColumns()

  const table = useTable(
    {
      data: configured_tax_regions || [],
      columns,
      manualPagination: true,
      autoResetPage: false,
    },
    usePagination
  )

  if (!configured_tax_regions || !tax_regions) return null

  return (
    <>
      {createModalOpen && (
        <CreateConfiguredTaxRegionModal
          configured_tax_regions={configured_tax_regions}
          tax_regions={tax_regions}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
      <div className="flex flex-row justify-end mb-2">
        <Button
          variant="primary"
          size="small"
          onClick={() => setCreateModalOpen(true)}
        >
          Add Region
        </Button>
      </div>
      <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full">
        {/* <Table enableSearch handleSearch={handleSearch} searchValue={query}> */}
        <Table>
          <Table.Head>
            {table.headerGroups?.map((headerGroup) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col) => (
                  <Table.HeadCell {...col.getHeaderProps()}>
                    {col.render("Header")}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>

          <Table.Body {...table.getTableBodyProps()}>
            {table.rows.map((row) => {
              table.prepareRow(row)

              return (
                <ConfiguredTaxRegionRow
                  key={row.original.id}
                  row={row}
                  className="[&>td]:py-2"
                />
              )
            })}
          </Table.Body>
        </Table>
      </div>
    </>
  )
}

export default ConfiguredTaxRegionsTable
