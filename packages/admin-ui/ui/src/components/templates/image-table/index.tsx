import { useMemo } from "react"
import { Controller } from "react-hook-form"
import { Column, useTable } from "react-table"
import { FormImage } from "../../../types/shared"
import { NestedForm } from "../../../utils/nested-form"
import Button from "../../fundamentals/button"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import IconTooltip from "../../molecules/icon-tooltip"
import Table from "../../molecules/table"
import RadioGroup from "../../organisms/radio-group"

export type ImageTableDataType = { id?: string } & FormImage

type ImageTableProps = {
  data: ImageTableDataType[]
  form: NestedForm<FormImage[]>
  onDelete: (index: number) => void
}

const ImageTable = ({ data, form, onDelete }: ImageTableProps) => {
  const { control, register, path } = form

  const columns = useMemo<
    Column<{ id?: string | undefined } & FormImage>[]
  >(() => {
    return [
      {
        Header: () => (
          <div className="ml-large min-w-[140px] max-w-[140px]">
            <span>Image</span>
          </div>
        ),
        maxWidth: 140,
        width: 140,
        collapse: true,
        accessor: "url",
        Cell: ({ cell: { value } }) => {
          return (
            <div className="py-base ml-large">
              <img
                className="h-[80px] w-[80px] rounded object-cover"
                src={value}
              />
            </div>
          )
        },
      },
      {
        Header: () => <span>File name</span>,
        accessor: "nativeFile",
        Cell: ({ cell }) => {
          return (
            <Controller
              control={control}
              name={path(`${cell.row.index}.nativeFile`)}
              render={({ field: { value } }) => {
                return (
                  <div className="w-full">
                    <p className="inter-small-regular">{value?.name}</p>
                    {value?.size && (
                      <span className="inter-small-regular text-grey-50">
                        {(value.size / 1024).toFixed(2)} KB
                      </span>
                    )}
                  </div>
                )
              }}
            />
          )
        },
      },
      {
        Header: () => (
          <div className="flex items-center justify-center gap-x-[6px]">
            <span>Thumbnail</span>
            <IconTooltip content="Select which image you want to use as the thumbnail for this product" />
          </div>
        ),
        id: "thumbnail",
        width: 120,
        collapse: true,
        Cell: ({ cell }) => {
          return (
            <div className="flex items-center justify-center">
              <RadioGroup.Dot value={cell.row.index} />
            </div>
          )
        },
      },
      {
        Header: () => null,
        id: "delete",
        width: 40,
        Cell: ({ row }) => {
          return (
            <Button
              onClick={() => onDelete(row.index)}
              variant="ghost"
              size="small"
              className="text-grey-40 mx-6 cursor-pointer p-1"
              type="button"
            >
              <TrashIcon size={20} />
            </Button>
          )
        },
      },
    ]
  }, [])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
      defaultColumn: {
        width: "auto",
      },
    })

  return (
    <Table {...getTableProps()}>
      <Table.Head>
        {headerGroups?.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col, index) => {
              return (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header", { index })}
                </Table.HeadCell>
              )
            })}
          </Table.HeadRow>
        ))}
      </Table.Head>
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row)
          return (
            <Table.Row {...row.getRowProps()} className="px-base" key={index}>
              {row.cells.map((cell) => {
                return (
                  <Table.Cell
                    width={cell.column.width}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default ImageTable
