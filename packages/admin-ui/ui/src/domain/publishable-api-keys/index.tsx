import { Route, Routes } from "react-router-dom"
import RouteContainer from "../../components/extensions/route-container"
import { useRoutes } from "../../providers/route-provider"

import Index from "./pages"

const PublishableApiKeysRoute = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/publishable-api-keys")

  return (
    <Routes>
      <Route index element={<Index />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={
              <RouteContainer
                route={r}
                previousPath={"/publishable-api-keys"}
              />
            }
          />
        )
      })}
    </Routes>
  )
}

export default PublishableApiKeysRoute
