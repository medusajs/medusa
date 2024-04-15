import {
  RouterProvider as Provider,
  createBrowserRouter,
} from "react-router-dom"

import { v1Routes } from "./v1"
import { v2Routes } from "./v2"

const V2_ENABLED = import.meta.env.VITE_MEDUSA_V2 === "true"

console.log(v2Routes)
const router = createBrowserRouter(V2_ENABLED ? v2Routes : v1Routes)

console.log(router)

export const RouterProvider = () => {
  return <Provider router={router} />
}
