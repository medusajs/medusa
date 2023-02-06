import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import DashboardRoute from "./domains/dashboard"
import OrdersRoute from "./domains/orders"
import ProductsRoute from "./domains/products"
import { ProtectedRoute } from "./routes/private-route"

const LoginPage = lazy(() => import("./pages/login"))

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardRoute />
        </ProtectedRoute>
      ),
    },
    {
      path: "/products",
      element: (
        <ProtectedRoute>
          <ProductsRoute />
        </ProtectedRoute>
      ),
    },
    {
      path: "/orders",
      element: (
        <ProtectedRoute>
          <OrdersRoute />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ],
  {
    basename: __BASE__,
  }
)

const Loading = () => (
  <div className="flex w-full h-screen justify-center items-center bg-grey-5 text-grey-90">
    <p>Loading</p>
  </div>
)

const App = () => (
  <Suspense fallback={<Loading />}>
    <RouterProvider router={router} />
  </Suspense>
)

export default App
