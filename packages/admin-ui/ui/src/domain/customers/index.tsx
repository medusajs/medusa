import { Route, Routes } from "react-router-dom"
import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import Details from "./details"
import CustomerGroups from "./groups"
import CustomersPageTableHeader from "./header"

const CustomerIndex = () => {
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
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
