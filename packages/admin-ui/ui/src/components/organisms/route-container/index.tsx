import { Route, Routes } from "react-router-dom"
import { useRoutes } from "../../../providers/route-provider"
import { Route as AdminRoute } from "../../../types/extensions"
import RouteErrorElement from "../../molecules/route-error-element"

type RouteContainerProps = {
  route: AdminRoute
  previousPath?: string
}

const RouteContainer = ({ route, previousPath = "" }: RouteContainerProps) => {
  const { Page, path, origin } = route

  const { getNestedRoutes } = useRoutes()

  const fullPath = `${previousPath}${path}`

  const nestedRoutes = getNestedRoutes(fullPath)

  const hasNestedRoutes = nestedRoutes.length > 0

  if (!hasNestedRoutes) {
    return <Page />
  }

  return (
    <>
      <Routes>
        <Route
          path={"/"}
          element={<Page />}
          errorElement={<RouteErrorElement origin={origin} />}
        />
        {nestedRoutes.map((r, i) => (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={fullPath} />}
          />
        ))}
      </Routes>
    </>
  )
}

export default RouteContainer
