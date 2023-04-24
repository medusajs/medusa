import React from "react"
import { useTable, usePagination } from "react-table"
import { Package } from "../../../hooks/admin/packages"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import Table from "../../molecules/table"
import { useVendorPackageTableColumns } from "./use-vendor-package-columns"

type UserTableProps = {
  vendorPackages: Package[]
  editPackageModal: (vendorPackage: Package) => void
  deletePackageModal: (vendorPackage: Package) => void
  triggerRefetch: () => void
}

const VendorPackagesTable: React.FC<UserTableProps> = ({
  editPackageModal,
  deletePackageModal,
  vendorPackages,
}) => {
  const columns = useVendorPackageTableColumns()

  const { getTableBodyProps, headerGroups, rows, prepareRow } = useTable<
    Package
  >(
    {
      columns,
      data: vendorPackages || [],
      manualPagination: true,
      pageCount: 1,
      autoResetPage: false,
    },
    usePagination
  )

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table>
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
              <Table.Row
                color={"inherit"}
                {...row.getRowProps()}
                className="group"
                actions={[
                  {
                    label: "Edit",
                    onClick: () => editPackageModal(row.original),
                    icon: <EditIcon size={20} />,
                  },
                  {
                    label: "Delete",
                    onClick: () => deletePackageModal(row.original),
                    icon: <TrashIcon size={20} />,
                  },
                ]}
              >
                {row.cells.map((cell, index) => {
                  return cell.render("Cell", { index })
                })}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default VendorPackagesTable
