import moment from "moment"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { getColor } from "../../../utils/color"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import ReactCountryFlag from "react-country-flag"

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
        Header: "Company",
        accessor: "metadata.company",
      },
      {
        Header: <div>Country</div>,
        accessor: "billing_address",
        Cell: ({ cell: { value } }) => (
            <div className="flex flex-row justify-start items-center gap-2">
              {value?.country_code ?
                <div className="rounded-rounded flex">
                    <ReactCountryFlag
                      className={"rounded"}
                      svg
                      countryCode={value?.country_code as string}
                    />
                </div>
                :
                ""
              }
              {value?.province ? <div>{value.province}</div> : ""}
              {value?.city ? <div>{value.city}</div> : ""}
            </div>
        ),
      },
      {
        accessor: "groups",
        Header: () => <div>Groups</div>,
        Cell: ({ cell: { value } }) => (
          <div className="flex flex-col gap-y-2">{value?.map(v=><div>{v.name}</div>) || ''}</div>
        ),
      },
      {
        accessor: "orders",
        Header: () => (
          <div className="text-right">
            {t("customer-table-orders", "Orders")}
          </div>
        ),
        Cell: ({ cell: { value } }) => (
          <div className="text-right">{value?.length || 0}</div>
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
