import after from "medusa-admin:widgets/product_category/details/after"
import before from "medusa-admin:widgets/product_category/details/before"
import { useAdminProductCategory } from "medusa-react"
import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { CategoryGeneralSection } from "./components/category-general-section"
import { CategoryOrganizationSection } from "./components/category-organization-section/category-organization-section.tsx"
import { CategoryProductsSection } from "./components/category-product-section/category-products-section.tsx"
import { categoryLoader } from "./loader.ts"

export const CategoryDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof categoryLoader>
  >

  const { id } = useParams()

  const { product_category, isLoading, isError, error } =
    useAdminProductCategory(id!, undefined, {
      initialData,
    })

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
      <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <CategoryGeneralSection category={product_category} />
          <CategoryProductsSection category={product_category} />
          <div className="flex flex-col gap-y-2 xl:hidden">
            <CategoryOrganizationSection category={product_category} />
          </div>
          <JsonViewSection data={product_category} />
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
        </div>
        <div className="hidden w-full max-w-[400px] flex-col gap-y-2 xl:flex">
          <CategoryOrganizationSection category={product_category} />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
