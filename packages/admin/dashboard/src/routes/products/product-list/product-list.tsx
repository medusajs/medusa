import { ProductListTable } from "./components/product-list-table"

import after from "virtual:medusa/widgets/product/list/after"
import before from "virtual:medusa/widgets/product/list/before"

export const ProductList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <ProductListTable />
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
