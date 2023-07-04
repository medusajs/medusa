import { Route, Routes } from "react-router-dom"
import RouteContainer from "../../components/extensions/route-container"
import { useRoutes } from "../../providers/route-provider"
import CollectionDetails from "./details"

const Collections = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/collections")

  return (
    <Routes>
      <Route path="/:id" element={<CollectionDetails />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={"/collections"} />}
          />
        )
      })}
    </Routes>
  )
}

export default Collections
