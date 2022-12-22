import { lazy } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useHotkeys } from "react-hotkeys-hook"
import { Route, Routes, useNavigate } from "react-router-dom"
import { WRITE_KEY } from "../components/constants/analytics"
import PrivateRoute from "../components/private-route"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"
import AnalyticsProvider from "../context/analytics"

const Oauth = lazy(() => import("../domain/oauth"))
const Products = lazy(() => import("../domain/products"))
const Collections = lazy(() => import("../domain/collections"))
const GiftCards = lazy(() => import("../domain/gift-cards"))
const Orders = lazy(() => import("../domain/orders"))
const DraftOrders = lazy(() => import("../domain/orders/draft-orders"))
const Discounts = lazy(() => import("../domain/discounts"))
const Customers = lazy(() => import("../domain/customers"))
const Pricing = lazy(() => import("../domain/pricing"))
const Settings = lazy(() => import("../domain/settings"))
const SalesChannels = lazy(() => import("../domain/sales-channels"))
const PublishableApiKeys = lazy(() => import("../domain/publishable-api-keys"))

const IndexPage = () => {
  const navigate = useNavigate()
  useHotkeys("g + o", () => navigate("/a/orders"))
  useHotkeys("g + p", () => navigate("/a/products"))

  return (
    <PrivateRoute>
      <DashboardRoutes />
    </PrivateRoute>
  )
}

const DashboardRoutes = () => {
  return (
    <AnalyticsProvider writeKey={WRITE_KEY}>
      <DndProvider backend={HTML5Backend}>
        <Layout>
          <SEO title="Medusa" />
          <Routes className="h-full">
            <Route path="oauth/:app_name" element={<Oauth/>} />
            <Route path="products/*" element={<Products/>} />
            <Route path="collections/*" element={<Collections />} />
            <Route path="gift-cards/*" element={<GiftCards/>} />
            <Route path="orders/*" element={<Orders/>} />
            <Route path="draft-orders/*" element={<DraftOrders />} />
            <Route path="discounts/*" element={<Discounts />} />
            <Route path="customers/*" element={<Customers />} />
            <Route path="pricing/*" element={<Pricing />} />
            <Route path="settings/*" element={<Settings />} />
            <Route path="sales-channels/*" element={<SalesChannels />} />
            <Route path="publishable-api-keys/*" element={<PublishableApiKeys />} />
          </Routes>
        </Layout>
      </DndProvider>
    </AnalyticsProvider>
  )
}

export default IndexPage
