import { Route, Routes } from "react-router-dom"
import RouteContainer from "../../components/extensions/route-container"
import { useRoutes } from "../../providers/route-provider"
import Details from "./pages/details"

const SalesChannels = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/sales-channels")

  return (
    <Routes>
      <Route index element={<Details />} />
      <Route path="/:id" element={<Details />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={
              <RouteContainer route={r} previousPath={"/sales-channels"} />
            }
          />
        )
      })}
    </Routes>
  )
}

export default SalesChannels
