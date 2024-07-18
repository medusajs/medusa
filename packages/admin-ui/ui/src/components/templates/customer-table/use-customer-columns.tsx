import moment from "moment"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "../../../utils/color"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"

export const useCustomerColumns = () => {
  const { t } = useTranslation()
  const columns = useMemo(
    () => [
      {
        Header: t("customer-table-date-added", "Date added"),
        accessor: "created_at", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => moment(value).format("DD MMM YYYY"),
      },
      {
        Header: t("customer-table-name", "Name"),
        accessor: "customer",
        Cell: ({ row }) => (
          <CustomerAvatarItem
            customer={row.original}
            color={getColor(row.index)}
          />
        ),
      },
      {
        Header: t("customer-table-email", "Email"),
        accessor: "email",
      },
      {
        Header: "",
        accessor: "col",
      },
      {
        accessor: "orders",
        Header: () => (
          <div className="text-end">{t("customer-table-orders", "Orders")}</div>
        ),
        Cell: ({ cell: { value } }) => (
          <div className="text-end">{value?.length || 0}</div>
        ),
      },
      {
        Header: "",
        accessor: "col-2",
      },
    ],
    []
  )

  return [columns]
}
