import React from "react"
import { Route, Routes } from "react-router-dom"
import { useRoutes } from "../../../providers/route-provider"
import { Route as AdminRoute, RouteSegment } from "../../../types/extensions"
import { isRoute } from "../../../utils/extensions"
import RouteErrorElement from "./route-error-element"
import { useRouteContainerProps } from "./use-route-container-props"

type RouteContainerProps = {
  route: AdminRoute | RouteSegment
  previousPath?: string
}

const RouteContainer = ({ route, previousPath = "" }: RouteContainerProps) => {
  const routeContainerProps = useRouteContainerProps()

  const isFullRoute = isRoute(route)

  const { path } = route

  const { getNestedRoutes } = useRoutes()

  const fullPath = `${previousPath}${path}`

  const nestedRoutes = getNestedRoutes(fullPath)

  const hasNestedRoutes = nestedRoutes.length > 0

  /**
   * If the route is only a segment, we need to render the nested routes that
   * are children of the segment. If the segment has no nested routes, we
   * return null.
   */
  if (!isFullRoute) {
    if (hasNestedRoutes) {
      return (
        <Routes>
          {nestedRoutes.map((r, i) => (
            <Route
              path={r.path}
              key={i}
              element={<RouteContainer route={r} previousPath={fullPath} />}
            />
          ))}
        </Routes>
      )
    }

    return null
  }

  const { Page, origin } = route

  const PageWithProps = React.createElement(Page, routeContainerProps)

  if (!hasNestedRoutes) {
    return PageWithProps
  }

  return (
    <>
      <Routes>
        <Route
          path={"/"}
          element={PageWithProps}
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
