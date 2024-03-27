import after from "medusa-admin:widgets/product_category/list/after"
import before from "medusa-admin:widgets/product_category/list/before"
import { Outlet } from "react-router-dom"
import { CategoryOverview } from "./components/category-overview"

export const CategoryList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <CategoryOverview />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <Outlet />
    </div>
  )
}
