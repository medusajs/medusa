import moment from "moment"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import Tooltip from "../../atoms/tooltip"

const useCollectionTableColumn = () => {
  const { t } = useTranslation()
  const columns = useMemo(
    () => [
      {
        Header: t("collections-table-title", "Title"),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return <div className="flex items-center">{original.title}</div>
        },
      },
      {
        Header: t("collections-table-handle", "Handle"),
        accessor: "handle",
        Cell: ({ cell: { value } }) => <div>/{value}</div>,
      },
      {
        Header: t("collections-table-created-at", "Created At"),
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <Tooltip content={moment(value).format("DD MMM YYYY hh:mm A")}>
            {moment(value).format("DD MMM YYYY")}
          </Tooltip>
        ),
      },
      {
        Header: t("collections-table-updated-at", "Updated At"),
        accessor: "updated_at",
        Cell: ({ cell: { value } }) => (
          <Tooltip content={moment(value).format("DD MMM YYYY hh:mm A")}>
            {moment(value).format("DD MMM YYYY")}
          </Tooltip>
        ),
      },
      {
        Header: t("collections-table-products", "Products"),
        accessor: "products",
        Cell: ({ cell: { value } }) => {
          return <div>{value?.length || "-"}</div>
        },
      },
    ],
    []
  )

  return [columns]
}

export default useCollectionTableColumn
