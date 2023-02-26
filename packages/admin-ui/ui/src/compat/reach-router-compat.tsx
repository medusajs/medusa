import { cloneElement, ReactElement } from "react"
import { Routes, Route, useParams } from "react-router-dom"

export { useLocation, useParams } from "react-router-dom"
export type { PathRouteProps as RouteComponentProps } from "react-router-dom"

/**
 * @deprecated
 */
const RouteElement = ({ el }: { el: ReactElement }) => {
  const params = useParams()
  return cloneElement(el, params)
}

type RouterProps = {
  children: ReactElement
}
/**
 * @deprecated
 */
export const Router = ({ children }: RouterProps) => {
  const routes: ReactElement[] = Array.isArray(children) ? children : [children]
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          path={route.props.path}
          element={<RouteElement el={route} />}
          key={route.props.path}
        />
      ))}
    </Routes>
  )
}
