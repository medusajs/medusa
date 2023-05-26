import type { Route as InjectedRoute } from "@medusajs/admin-shared"
import { Route, Routes } from "react-router-dom"
import { usePages } from "../../../providers/page-provider"

type RouteContainerProps = {
  route: InjectedRoute
}

const RouteContainer = ({ route }: RouteContainerProps) => {
  const { Page, path } = route

  const { getNestedRoutes } = usePages()

  const nestedRoutes = getNestedRoutes(path)

  const hasNestedRoutes = nestedRoutes.length > 0

  if (!hasNestedRoutes) {
    return <Page />
  }

  return (
    <>
      <Routes>
        <Route path={"/"} element={<Page />} />
        {nestedRoutes.map((r, i) => (
          <Route path={r.path} key={i} element={<RouteContainer route={r} />} />
        ))}
      </Routes>
    </>
  )
}

export default RouteContainer
