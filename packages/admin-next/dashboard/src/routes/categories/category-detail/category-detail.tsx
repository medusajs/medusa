import { useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useCategory } from "../../../hooks/api/categories"
import { CategoryGeneralSection } from "./components/category-general-section"
import { CategoryOrganizationSection } from "./components/category-organization-section"
import { CategoryProductSection } from "./components/category-product-section"
import { categoryLoader } from "./loader"

import after from "virtual:medusa/widgets/product_category/details/after"
import before from "virtual:medusa/widgets/product_category/details/before"
import sideAfter from "virtual:medusa/widgets/product_category/details/side/after"
import sideBefore from "virtual:medusa/widgets/product_category/details/side/before"

export const CategoryDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof categoryLoader>
  >

  const { product_category, isLoading, isError, error } = useCategory(
    id!,
    undefined,
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
      <div className="flex flex-col gap-x-4 xl:flex-row xl:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <CategoryGeneralSection category={product_category} />
          <CategoryProductSection category={product_category} />
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
          <div className="hidden xl:block">
            <JsonViewSection data={product_category} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 xl:mt-0 xl:max-w-[400px]">
          {sideBefore.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
          <CategoryOrganizationSection category={product_category} />
          {sideAfter.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
          <div className="xl:hidden">
            <JsonViewSection data={product_category} />
          </div>
        </div>
      </div>
    </div>
  )
}
