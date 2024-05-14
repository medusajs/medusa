import {
  createBrowserRouter,
  RouterProvider as Provider,
} from "react-router-dom"

const router = createBrowserRouter(
  [
    {
      path: "/",
      lazy: () => import("../../routes/home"),
    },
  ],
  {
    basename: __BASE__ || "/",
  }
)

export const RouterProvider = () => {
  return <Provider router={router} />
}
