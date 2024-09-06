import { Outlet } from "react-router-dom"
import { ProductTypeListTable } from "./components/product-type-list-table"

import after from "virtual:medusa/widgets/product_type/list/after"
import before from "virtual:medusa/widgets/product_type/list/before"

export const ProductTypeList = () => {
  return (
    <div className="flex flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <ProductTypeListTable />
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
