import { lazy, Suspense } from "react"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"
import Spinner from "./components/atoms/spinner"
import { AnalyticsProvider } from "./providers/analytics-provider"
import { WRITE_KEY } from "./constants/analytics"

const NotFound = lazy(() => import("./pages/404"))
const Dashboard = lazy(() => import("./pages/a"))
const IndexPage = lazy(() => import("./pages/index"))
const InvitePage = lazy(() => import("./pages/invite"))
const LoginPage = lazy(() => import("./pages/login"))
const ResetPasswordPage = lazy(() => import("./pages/reset-password"))

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<IndexPage />} />
      <Route
        path="a/*"
        element={
          <AnalyticsProvider writeKey={WRITE_KEY}>
            <Dashboard />
          </AnalyticsProvider>
        }
      />
      <Route
        path="invite"
        element={
          <AnalyticsProvider writeKey={WRITE_KEY}>
            <InvitePage />
          </AnalyticsProvider>
        }
      />
      <Route path="login" element={<LoginPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    basename: process.env.ADMIN_PATH,
  }
)

const Loading = () => (
  <div className="bg-grey-5 text-grey-90 flex h-screen w-full items-center justify-center">
    <Spinner variant="secondary" />
  </div>
)

const App = () => (
  <Suspense fallback={<Loading />}>
    <RouterProvider router={router} />
  </Suspense>
)

export default App
