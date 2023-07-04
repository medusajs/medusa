import { Route, Routes } from "react-router-dom"
import RouteContainer from "../../components/extensions/route-container"
import { useRoutes } from "../../providers/route-provider"
import Edit from "./edit"
import Overview from "./overview"

const ProductsRoute = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/products")

  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="/:id" element={<Edit />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={"/products"} />}
          />
        )
      })}
    </Routes>
  )
}

export default ProductsRoute
