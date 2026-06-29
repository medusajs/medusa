import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { useLoaderData, useParams } from "react-router-dom"
import { useProductCategory } from "../../../hooks/api/categories"
import { CategoryGeneralSection } from "./components/category-general-section"
import { CategoryOrganizeSection } from "./components/category-organize-section"
import { CategoryProductSection } from "./components/category-product-section"
import { categoryLoader } from "./loader"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer, detailPageDefaultEntries } from "../../../components/layout-composer"

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
    <LayoutComposer
      widgetsZonePrefix="product_category.details"
      preferredLayoutId={CORE_LAYOUT_IDS.TWO_COLUMN}
      data={product_category}
      sections={{
        main: (
          <>
            <LayoutComposer.Entry id="CategoryGeneralSection">
              <CategoryGeneralSection category={product_category} />
            </LayoutComposer.Entry>
            <LayoutComposer.Entry id="CategoryProductSection">
              <CategoryProductSection category={product_category} />
            </LayoutComposer.Entry>
            {detailPageDefaultEntries(product_category)}
          </>
        ),
        side: (
          <>
            <LayoutComposer.Entry id="CategoryOrganizeSection">
              <CategoryOrganizeSection category={product_category} />
            </LayoutComposer.Entry>
          </>
        ),
      }}
    />
  )
}
