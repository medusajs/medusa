import React from "react"
import PrivateRoute from "../components/private-route"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"
import Customers from "../domain/customers"
import Orders from "../domain/orders"
import DraftOrders from "../domain/orders/draft-orders"
import Pricing from "../domain/pricing"
import Products from "../domain/products"
import Users from "../domain/vendors/users"
import { SelectedVendorContext } from "../context/vendor"
import { useGetVendor } from "../hooks/admin/vendors/queries"
import VendorSettings from "../domain/vendors/settings"
import Spinner from "../components/atoms/spinner"
import PersonalInformation from "../domain/settings/personal-information"
import Balance from "../domain/balance"
import Dashboard from "../domain/dashboard"
import Payouts from "../domain/payouts"
import { Route, Routes, useParams } from "react-router-dom"
import { HTML5Backend } from "react-dnd-html5-backend"
import AnalyticsProvider from "../context/analytics"
import { DndProvider } from "react-dnd"
import { WRITE_KEY } from "../components/constants/analytics"

const IndexPage = () => {
  const { vendor_id } = useParams<{ vendor_id: string }>()
  const { vendor, isError, isFetched } = useGetVendor(vendor_id)

  if (!isFetched && !vendor) {
    return <Spinner size="large" variant="secondary" />
  }

  if ((isFetched && !vendor) || isError) {
    return (
      <>
        You might not have permissions to view this vendor, please refresh the
        page and try again.
      </>
    )
  }

  return (
    <SelectedVendorContext.Provider value={vendor}>
      <AnalyticsProvider writeKey={WRITE_KEY}>
        <DndProvider backend={HTML5Backend}>
          <Layout>
            <SEO title={vendor?.name} />
            <Routes>
              <Route path="/products/*" element={<Products />} />
              {/* <Route path="collections/*" element={<Collections/>} /> */}
              <Route path="/orders/*" element={<Orders />} />
              <Route path="/draft-orders/*" element={<DraftOrders />} />
              <Route path="/settings/*" element={<VendorSettings />} />
              {/* <Route path="discounts/*" element={<Discounts/>} /> */}
              <Route path="/customers/*" element={<Customers />} />
              <Route path="/pricing/*" element={<Pricing />} />
              <Route path="/users/*" element={<Users />} />
              <Route
                path="/personal-information"
                element={<PersonalInformation />}
              />
              <Route path="/balance/*" element={<Balance />} />
              <Route path="/payouts/*" element={<Payouts />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </Layout>
        </DndProvider>
      </AnalyticsProvider>
    </SelectedVendorContext.Provider>
  )
}

const IndexPageWrapper = (props) => (
  <PrivateRoute
    component={() => (
      <Routes>
        <Route path="/:vendor_id/*" element={<IndexPage />} />
      </Routes>
    )}
  />
)

export default IndexPageWrapper
