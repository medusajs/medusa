import { PromotionListTable } from "./components/promotion-list-table"

import after from "virtual:medusa/widgets/promotion/list/after"
import before from "virtual:medusa/widgets/promotion/list/before"

export const PromotionsList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <PromotionListTable />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
    </div>
  )
}
