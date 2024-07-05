import after from "medusa-admin:widgets/product/list/after"
import before from "medusa-admin:widgets/product/list/before"

import { ProductListTable } from "./components/product-list-table"

export const ProductList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => (
        <w.Component key={i} />
      ))}
      <ProductListTable />
      {after.widgets.map((w, i) => (
        <w.Component key={i} />
      ))}
    </div>
  )
}
