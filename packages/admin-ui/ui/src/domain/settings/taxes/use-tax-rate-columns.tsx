import { useMemo } from "react"
import { Column } from "react-table"
import { useTranslation } from "react-i18next"
import Badge from "../../../components/fundamentals/badge"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import { TaxRateTableEntries } from "./details"

const useTaxRateColumns = () => {
  const { t } = useTranslation()
  const columns: Column<TaxRateTableEntries>[] = useMemo(
    () => [
      {
        Header: <div className="pl-2">{t("taxes-name", "Name")}</div>,
        accessor: "name",
        Cell: ({ row, cell: { value } }) => {
          return (
            <div className="text-grey-90 group-hover:text-violet-60 pl-2">
              {row.original.type === "region" ? (
                <div className="gap-x-xsmall text-grey-40 flex items-center">
                  <LockIcon size={"12"} /> {value}
                </div>
              ) : (
                value
              )}
            </div>
          )
        },
      },
      {
        Header: t("taxes-code", "Code"),
        accessor: "code",
        Cell: ({ cell: { value } }) => (
          <div>
            <Badge variant="default">{value}</Badge>
          </div>
        ),
      },
      {
        Header: t("taxes-tax-rate", "Tax Rate"),
        accessor: "rate",
        Cell: ({ cell: { value } }) => <div>{value} %</div>,
      },
    ],
    []
  )

  return [columns]
}

export default useTaxRateColumns
