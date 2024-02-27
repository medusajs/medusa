import after from "medusa-admin:widgets/discount/list/after"
import before from "medusa-admin:widgets/discount/list/before"

import { DiscountListTable } from "./components/discount-list-table"

export const DiscountsList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => (
        <w.Component key={i} />
      ))}
      <DiscountListTable />
      {after.widgets.map((w, i) => (
        <w.Component key={i} />
      ))}
    </div>
  )
}
