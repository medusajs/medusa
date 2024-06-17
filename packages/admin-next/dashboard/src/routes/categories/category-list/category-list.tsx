import { Outlet } from "react-router-dom"
import { CategoryListTable } from "./components/category-list-table"

import after from "virtual:medusa/widgets/product_category/list/after"
import before from "virtual:medusa/widgets/product_category/list/before"

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
      <CategoryListTable />
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
