import { Route, Routes } from "react-router-dom"
import RouteContainer from "../../components/extensions/route-container"
import { useRoutes } from "../../providers/route-provider"

import ProductCategoryIndex from "./pages"

const ProductCategories = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/product-categories")

  return (
    <Routes>
      <Route index element={<ProductCategoryIndex />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={
              <RouteContainer route={r} previousPath={"/product-categories"} />
            }
          />
        )
      })}
    </Routes>
  )
}

export default ProductCategories
