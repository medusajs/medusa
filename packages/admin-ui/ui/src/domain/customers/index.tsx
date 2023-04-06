import { Route, Routes } from "react-router-dom"
import Spacer from "../../components/atoms/spacer"
import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import Details from "./details"
import CustomerGroups from "./groups"
import CustomersPageTableHeader from "./header"

const CustomerIndex = () => {
  return (
    <div>
      <BodyCard
        customHeader={<CustomersPageTableHeader activeView="customers" />}
        className="h-fit"
      >
        <CustomerTable />
      </BodyCard>
      <Spacer />
    </div>
  )
}

const Customers = () => {
  return (
    <Routes>
      <Route index element={<CustomerIndex />} />
      <Route path="/groups/*" element={<CustomerGroups />} />
      <Route path="/:id" element={<Details />} />
    </Routes>
  )
}

export default Customers
