import { lazy, Suspense } from "react"
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom"
import Spinner from "./components/atoms/spinner"
import BaseLayout from "./components/templates/base-layout"

const NotFound = lazy(() => import("./pages/404"))
const Admin = lazy(() => import("./pages/admin"))
const Vendor = lazy(() => import("./pages/vendor"))
const IndexPage = lazy(() => import("./pages/index"))
const InvitePage = lazy(() => import("./pages/invite"))
const LoginPage = lazy(() => import("./pages/login"))
const ResetPasswordPage = lazy(() => import("./pages/reset-password"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<IndexPage />} />
      <Route path="admin/*" element={<Admin />} />
      <Route path="vendor/*" element={<Vendor />} />
      <Route path="invite" element={<InvitePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
)

const Loading = () => (
  <div className="flex w-full h-screen justify-center items-center bg-grey-5 text-grey-90">
    <Spinner variant="secondary" />
  </div>
)

const App = () => (
  <Suspense fallback={<Loading />}>
    <BaseLayout>
      <RouterProvider router={router} />
    </BaseLayout>
  </Suspense>
)

export default App
