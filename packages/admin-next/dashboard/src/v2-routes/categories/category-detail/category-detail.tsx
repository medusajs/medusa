import { useLoaderData, useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { useCategory } from "../../../hooks/api/categories"
import { CategoryGeneralSection } from "./components/category-general-section"
import { CategoryOrganizationSection } from "./components/category-organization-section"
import { CategoryProductSection } from "./components/category-product-section"
import { categoryLoader } from "./loader"

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
      <div className="flex flex-col gap-x-4 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-y-2">
          <CategoryGeneralSection category={product_category} />
          <CategoryProductSection category={product_category} />
          <div className="hidden lg:block">
            <JsonViewSection data={product_category} />
          </div>
        </div>
        <div className="mt-2 flex w-full max-w-[100%] flex-col gap-y-2 lg:mt-0 lg:max-w-[400px]">
          <CategoryOrganizationSection category={product_category} />
          <div className="lg:hidden">
            <JsonViewSection data={product_category} />
          </div>
        </div>
      </div>
    </div>
  )
}
