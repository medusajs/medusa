import {
  RouterProvider as Provider,
  createBrowserRouter,
} from "react-router-dom"

import { RouteMap } from "./route-map"

const router = createBrowserRouter(RouteMap, {
  basename: __BASE__ || "/",
})

export const RouterProvider = () => {
  return <Provider router={router} />
}
