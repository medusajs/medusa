import React from "react"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"
import Collections from "../domain/collections"
import Customers from "../domain/customers"
import Discounts from "../domain/discounts"
import GiftCards from "../domain/gift-cards"
import Oauth from "../domain/oauth"
import Orders from "../domain/orders"
import DraftOrders from "../domain/orders/draft-orders"
import Pricing from "../domain/pricing"
import Products from "../domain/products"
import { SelectedVendorContext } from "../context/vendor"
import { useGetVendors } from "../hooks/admin/vendors/queries"
import { useUserPermissions } from "../hooks/use-permissions"
import Vendors from "../domain/vendors"
import TeamMembers from "../domain/settings/users"
import Taxes from "../domain/settings/taxes"
import PersonalInformation from "../domain/settings/personal-information"
import AdminSettings from "../domain/settings"
import Content from "../domain/content"
import EditorIndex from "../domain/editor"
import Balance from "../domain/balance"
import Dashboard from "../domain/dashboard"
import Payouts from "../domain/payouts"
import EmailIndex from "../domain/email"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import PrivateRoute from "../components/private-route"
import AnalyticsProvider from "../context/analytics"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { WRITE_KEY } from "../components/constants/analytics"
import { useAdminStore } from "medusa-react"

const IndexPage = () => {
  const { vendors } = useGetVendors()
  const { store } = useAdminStore()
  const { isLoggedIn, isAdmin } = useUserPermissions()
  const location = useLocation()

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  if (!isLoggedIn || !vendors) {
    return <>Loading</>
  }

  if (
    (!isAdmin && vendors.length > 0) ||
    (vendors.length === 1 && location.pathname === "/admin")
  ) {
    return <Navigate to={`/vendor/${vendors[0].id}`} />
  }

  if (!isAdmin) {
    return <>Loading</>
  }

  return (
    <SelectedVendorContext.Provider value={null}>
      <AnalyticsProvider writeKey={WRITE_KEY}>
        <DndProvider backend={HTML5Backend}>
          <SEO title={store?.name} />

          <Routes>
            <Route
              path="/oauth/:app_name"
              element={
                <Layout>
                  <Oauth />
                </Layout>
              }
            />
            <Route
              path="/vendors/*"
              element={
                <Layout>
                  <Vendors />
                </Layout>
              }
            />
            <Route
              path="/products/*"
              element={
                <Layout>
                  <Products />
                </Layout>
              }
            />
            <Route
              path="/collections/*"
              element={
                <Layout>
                  <Collections />
                </Layout>
              }
            />
            <Route
              path="/gift-cards/*"
              element={
                <Layout>
                  <GiftCards />
                </Layout>
              }
            />
            <Route
              path="/orders/*"
              element={
                <Layout>
                  <Orders />
                </Layout>
              }
            />
            <Route
              path="/draft-orders/*"
              element={
                <Layout>
                  <DraftOrders />
                </Layout>
              }
            />
            <Route
              path="/discounts/*"
              element={
                <Layout>
                  <Discounts />
                </Layout>
              }
            />
            <Route
              path="/customers/*"
              element={
                <Layout>
                  <Customers />
                </Layout>
              }
            />
            <Route
              path="/pricing/*"
              element={
                <Layout>
                  <Pricing />
                </Layout>
              }
            />
            <Route
              path="/settings/*"
              element={
                <Layout>
                  <AdminSettings />
                </Layout>
              }
            />
            <Route
              path="/taxes"
              element={
                <Layout>
                  <Taxes />
                </Layout>
              }
            />
            <Route
              path="/users"
              element={
                <Layout>
                  <TeamMembers />
                </Layout>
              }
            />
            <Route
              path="/content/*"
              element={
                <Layout>
                  <Content />
                </Layout>
              }
            />
            <Route
              path="/personal-information"
              element={
                <Layout>
                  <PersonalInformation />{" "}
                </Layout>
              }
            />
            <Route
              path="/balance/*"
              element={
                <Layout>
                  <Balance />
                </Layout>
              }
            />
            <Route
              path="/payouts/*"
              element={
                <Layout>
                  <Payouts />
                </Layout>
              }
            />
            <Route
              path="/"
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
            />

            <Route path="/editor/*" element={<EditorIndex />} />
            <Route path="/email/*" element={<EmailIndex />} />
          </Routes>
        </DndProvider>
      </AnalyticsProvider>
    </SelectedVendorContext.Provider>
  )
}

const IndexPageWrapper = () => {
  return <PrivateRoute component={IndexPage}></PrivateRoute>
}

export default IndexPageWrapper
