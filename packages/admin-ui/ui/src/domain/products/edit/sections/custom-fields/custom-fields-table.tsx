import React, { useMemo, useState } from "react"
import { Column, useTable } from "react-table"
import { CustomProductField } from "."
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import Actionables from "../../../../../components/molecules/actionables"
import Table from "../../../../../components/molecules/table"
import { EditCustomFieldModal } from "./edit-custom-field-modal"

type Props = {
  fields: CustomProductField[]
  actions: {
    save: (fields: CustomProductField[]) => void
  }
}

const useColumns = () => {
  const columns = useMemo<Column<CustomProductField>[]>(
    () => [
      {
        Header: "Label",
        id: "label",
        accessor: "label",
      },
      {
        Header: "Value",
        id: "value",
        accessor: "value",

        Cell: ({ cell }) => {
          return <div className="line-clamp-3">{cell.value}</div>
        },
      },
    ],
    []
  )

  return columns
}

const CustomFieldsTable = ({ fields, actions }: Props) => {
  const columns = useColumns()

  const [selectedEditField, setSelectedEditField] =
    useState<CustomProductField | null>(null)

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: fields,
      defaultColumn: {
        width: "auto",
      },
    })

  const { save } = actions

  const saveField = (field: CustomProductField) => {
    save(fields.map((f) => (f.key === field.key ? field : f)))
  }

  return (
    <>
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
                          label: "Edit",
                          icon: <EditIcon size="20" />,
                          onClick: () => setSelectedEditField(row.original),
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

      {!!selectedEditField && (
        <EditCustomFieldModal
          field={selectedEditField}
          save={saveField}
          handleClose={() => setSelectedEditField(null)}
        />
      )}
    </>
  )
}

export default CustomFieldsTable
