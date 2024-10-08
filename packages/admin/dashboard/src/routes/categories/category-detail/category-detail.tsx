import { useLoaderData, useParams } from "react-router-dom"
import { useProductCategory } from "../../../hooks/api/categories"
import { CategoryGeneralSection } from "./components/category-general-section"
import { CategoryOrganizeSection } from "./components/category-organize-section"
import { CategoryProductSection } from "./components/category-product-section"
import { categoryLoader } from "./loader"

import after from "virtual:medusa/widgets/product_category/details/after"
import before from "virtual:medusa/widgets/product_category/details/before"
import sideAfter from "virtual:medusa/widgets/product_category/details/side/after"
import sideBefore from "virtual:medusa/widgets/product_category/details/side/before"
import { TwoColumnPage } from "../../../components/layout/pages"

export const CategoryDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof categoryLoader>
  >

  const { product_category, isLoading, isError, error } = useProductCategory(
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
    <TwoColumnPage
      widgets={{
        after,
        before,
        sideAfter,
        sideBefore,
      }}
      data={product_category}
      showJSON
      showMetadata
      hasOutlet
    >
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={product_category} />
          </div>
        )
      })}
      <TwoColumnPage.Main>
        <CategoryGeneralSection category={product_category} />
        <CategoryProductSection category={product_category} />
        {after.widgets.map((w, i) => {
          return (
            <div key={i}>
              <w.Component data={product_category} />
            </div>
          )
        })}
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        {sideBefore.widgets.map((w, i) => {
          return (
            <div key={i}>
              <w.Component data={product_category} />
            </div>
          )
        })}
        <CategoryOrganizeSection category={product_category} />
        {sideAfter.widgets.map((w, i) => {
          return (
            <div key={i}>
              <w.Component data={product_category} />
            </div>
          )
        })}
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
