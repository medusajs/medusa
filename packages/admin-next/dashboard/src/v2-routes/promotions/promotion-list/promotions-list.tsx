// TODO: This needs to be replaced with promotions
// Question: Where is this being initialized?
import after from "medusa-admin:widgets/discount/list/after"
import before from "medusa-admin:widgets/discount/list/before"

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
