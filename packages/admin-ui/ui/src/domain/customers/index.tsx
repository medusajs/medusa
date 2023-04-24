import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import CustomerGroups from "./groups"
import Details from "./details"
import CustomersPageTableHeader from "./header"
import { Route, Routes } from "react-router-dom"

const CustomerIndex = () => {
  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          customHeader={<CustomersPageTableHeader activeView="customers" />}
          className="h-fit"
        >
          <CustomerTable />
        </BodyCard>
      </div>
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
