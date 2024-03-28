import after from "medusa-admin:widgets/promotion/list/after"
import before from "medusa-admin:widgets/promotion/list/before"

import { PromotionListTable } from "./components/promotion-list-table"

export const PromotionsList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => (
        <w.Component key={i} />
      ))}

      <PromotionListTable />

      {after.widgets.map((w, i) => (
        <w.Component key={i} />
      ))}
    </div>
  )
}
