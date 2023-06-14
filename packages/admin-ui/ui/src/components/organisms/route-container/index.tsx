import { Route, Routes } from "react-router-dom"
import { useRoutes } from "../../../providers/route-provider"
import { Route as AdminRoute } from "../../../types/extensions"

type RouteContainerProps = {
  route: AdminRoute
  previousPath?: string
}

const RouteContainer = ({ route, previousPath = "" }: RouteContainerProps) => {
  const { Page, path } = route

  const { getNestedRoutes, getOptimizedNestedRoutes } = useRoutes()

  const fullPath = `${previousPath}${path}`

  const nestedRoutes = getNestedRoutes(fullPath)
  const optimized = getOptimizedNestedRoutes(fullPath)

  console.log(JSON.stringify(optimized, null, 2))

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
