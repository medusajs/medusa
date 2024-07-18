import { Product } from "@medusajs/medusa"
import { useMemo } from "react"
import { Column, HeaderGroup, Row } from "react-table"
import { useTranslation } from "react-i18next"
import SortingIcon from "../../../../../../components/fundamentals/icons/sorting-icon"
import ImagePlaceholder from "../../../../../../components/fundamentals/image-placeholder"
import StatusIndicator from "../../../../../../components/fundamentals/status-indicator"
import Table from "../../../../../../components/molecules/table"

const getProductStatusVariant = (status: string) => {
  switch (status) {
    case "proposed":
      return "warning"
    case "published":
      return "success"
    case "rejected":
      return "danger"
    case "draft":
    default:
      return "default"
  }
}

export const ProductRow = ({ row }: { row: Row<Product> }) => {
  return (
    <Table.Row {...row.getRowProps()}>
      {row.cells.map((cell) => {
        return (
          <Table.Cell {...cell.getCellProps()}>
            {cell.render("Cell")}
          </Table.Cell>
        )
      })}
    </Table.Row>
  )
}

export const ProductsHeader = ({
  headerGroup,
}: {
  headerGroup: HeaderGroup<Product>
}) => {
  return (
    <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
      {headerGroup.headers.map((col) => (
        <Table.HeadCell
          className="w-[100px]"
          {...col.getHeaderProps(col.getSortByToggleProps())}
        >
          {col.render("Header")}
        </Table.HeadCell>
      ))}
    </Table.HeadRow>
  )
}

export const useProductColumns = () => {
  const { t } = useTranslation()
  const columns = useMemo<Column<Product>[]>(() => {
    return [
      {
        Header: () => (
          <div className="flex min-w-[443px] items-center gap-1">
            {t("shared-title", "Title")} <SortingIcon size={16} />
          </div>
        ),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="my-1.5 me-4 flex h-[40px] w-[30px] items-center">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="rounded-soft h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              <div className="flex flex-col">
                <span>{original.title}</span>
              </div>
            </div>
          )
        },
      },
      {
        Header: () => (
          <div className="flex items-center gap-1">
            {t("shared-status", "Status")} <SortingIcon size={16} />
          </div>
        ),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <StatusIndicator
            title={`${original.status
              .charAt(0)
              .toUpperCase()}${original.status.slice(1)}`}
            variant={getProductStatusVariant(original.status)}
          />
        ),
      },
      {
        Header: () => (
          <div className="flex items-center justify-end gap-1">
            {t("shared-variants", "Variants")} <SortingIcon size={16} />
          </div>
        ),
        id: "variants",
        accessor: (row) => row.variants.length,
        Cell: ({ cell: { value } }) => {
          return <div className="text-end">{value}</div>
        },
      },
    ]
  }, [])

  return columns
}
