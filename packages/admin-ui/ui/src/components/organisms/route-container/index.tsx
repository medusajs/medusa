import type { Route as InjectedRoute } from "@medusajs/admin-shared"
import { Route, Routes } from "react-router-dom"
import { useRoutes } from "../../../providers/route-provider"

type RouteContainerProps = {
  route: InjectedRoute
  previousPath?: string
}

const RouteContainer = ({ route, previousPath = "" }: RouteContainerProps) => {
  const { Page, path } = route

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
        <Route path={"/"} element={<Page />} />
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
