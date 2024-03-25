import after from "medusa-admin:widgets/product_category/list/after"
import before from "medusa-admin:widgets/product_category/list/before"
import { CategoryTree } from "./components/category-tree"

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
      <CategoryTree />
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
