import { Outlet, useLoaderData, useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useProductType } from "../../../hooks/api/product-types"
import { ProductTypeGeneralSection } from "./components/product-type-general-section"
import { ProductTypeProductSection } from "./components/product-type-product-section"
import { productTypeLoader } from "./loader"

import after from "virtual:medusa/widgets/product_type/details/after"
import before from "virtual:medusa/widgets/product_type/details/before"

export const ProductTypeDetail = () => {
  const { id } = useParams()
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof productTypeLoader>
  >

  const { product_type, isPending, isError, error } = useProductType(
    id!,
    undefined,
    {
      initialData,
    }
  )

  if (isPending || !product_type) {
    return null
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-3">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={product_type} />
          </div>
        )
      })}
      <ProductTypeGeneralSection productType={product_type} />
      <ProductTypeProductSection productType={product_type} />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component data={product_type} />
          </div>
        )
      })}
      <JsonViewSection data={product_type} />
      <Outlet />
    </div>
  )
}
