import { useLoaderData, useParams } from "react-router-dom"
import { useProductCategory } from "../../../hooks/api/categories"
import { CategoryGeneralSection } from "./components/category-general-section"
import { CategoryOrganizeSection } from "./components/category-organize-section"
import { CategoryProductSection } from "./components/category-product-section"
import { categoryLoader } from "./loader"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"

export const CategoryDetail = () => {
  const { id } = useParams()

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof categoryLoader>
  >

  const { getWidgets } = useDashboardExtension()

  const { product_category, isLoading, isError, error } = useProductCategory(
    id!,
    undefined,
    {
      initialData,
    }
  )

  if (isLoading || !product_category) {
    return (
      <TwoColumnPageSkeleton
        mainSections={2}
        sidebarSections={1}
        showJSON
        showMetadata
      />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        after: getWidgets("product_category.details.after"),
        before: getWidgets("product_category.details.before"),
        sideAfter: getWidgets("product_category.details.side.after"),
        sideBefore: getWidgets("product_category.details.side.before"),
      }}
      showJSON
      showMetadata
      data={product_category}
    >
      <TwoColumnPage.Main>
        <CategoryGeneralSection category={product_category} />
        <CategoryProductSection category={product_category} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <CategoryOrganizeSection category={product_category} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
