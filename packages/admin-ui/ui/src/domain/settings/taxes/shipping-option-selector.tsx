import { useMemo, useState } from "react"
import { useAdminShippingOptions } from "medusa-react"
import { useTranslation } from "react-i18next"
import { SelectableTable } from "./selectable-table"

export const ShippingOptionSelector = ({ regionId, items, onChange }) => {
  const PAGE_SIZE = 12
  const { t } = useTranslation()

  const [pagination, setPagination] = useState({
    limit: PAGE_SIZE,
    offset: 0,
  })

  const { isLoading, count, shipping_options } = useAdminShippingOptions({
    region_id: regionId,
  })

  const columns = useMemo(() => {
    return [
      {
        Header: t("taxes-name", "Name"),
        accessor: "name",
        Cell: ({ row: { original } }) => {
          return <div className="w-[200px]">{original.name}</div>
        },
      },
    ]
  }, [])

  return (
    <SelectableTable
      showSearch={false}
      label={t("taxes-select-shipping-option", "Select Shipping Option")}
      objectName={t("taxes-shipping-options", "Shipping Options")}
      totalCount={count}
      pagination={pagination}
      onPaginationChange={setPagination}
      selectedIds={items}
      data={shipping_options}
      columns={columns}
      isLoading={isLoading}
      onChange={onChange}
    />
  )
}
