import after from "medusa-admin:widgets/product_category/details/after"
import before from "medusa-admin:widgets/product_category/details/before"
import { useAdminProductCategory } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { CategoryGeneralSection } from "./components/category-general-section"
import { CategoryProductSection } from "./components/category-product-section"
import { categoryLoader } from "./loader"

export const CategoryDetail = () => {
  const { id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof categoryLoader>
  >

  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(
      id!,
      {
        include_ancestors_tree: true,
      },
      {
        initialData,
      }
    )

  if (isLoading || !product_category) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
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
      <CategoryProductSection category={product_category} />
      <JsonViewSection data={product_category} />
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
