import { Route, Routes } from "react-router-dom"
import Spacer from "../../components/atoms/spacer"
import BodyCard from "../../components/organisms/body-card"
import WidgetContainer from "../../components/organisms/widget-container"
import CustomerTable from "../../components/templates/customer-table"
import { useWidgets } from "../../providers/widget-provider"
import Details from "./details"
import CustomerGroups from "./groups"
import CustomersPageTableHeader from "./header"

const CustomerIndex = () => {
  const { getWidgets } = useWidgets()

  return (
    <div className="gap-y-xsmall flex flex-col">
      {getWidgets("customer.list.before").map((w, index) => {
        return (
          <WidgetContainer
            key={index}
            entity={null}
            widget={w}
            injectionZone="customer.list.before"
          />
        )
      })}

      <BodyCard
        customHeader={<CustomersPageTableHeader activeView="customers" />}
        className="h-fit"
      >
        <CustomerTable />
      </BodyCard>

      {getWidgets("customer.list.after").map((w, index) => {
        return (
          <WidgetContainer
            key={index}
            entity={null}
            widget={w}
            injectionZone="customer.list.after"
          />
        )
      })}
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
