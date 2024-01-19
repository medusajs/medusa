import after from "medusa-admin:widgets/product_category/details/after"
import before from "medusa-admin:widgets/product_category/details/before"
import { useAdminProductCategory } from "medusa-react"
import { Outlet, json, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { CategoryGeneralSection } from "./components/category-general-section"
import { CategoryProductSection } from "./components/category-product-section"
import { CategorySubcategorySection } from "./components/category-subcategory-section"

export const CategoryDetail = () => {
  const { id } = useParams()
  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(id!)

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError || !product_category) {
    if (error) {
      throw error
    }

    return json("An unknown error occurred", 500)
  }

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <CategoryGeneralSection category={product_category} />
      <CategorySubcategorySection category={product_category} />
      <CategoryProductSection category={product_category} />
      <JsonViewSection data={product_category} />
      <Outlet />
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
