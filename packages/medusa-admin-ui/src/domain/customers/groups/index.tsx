import { useContext } from "react"
import BodyCard from "../../../components/organisms/body-card"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import CustomersPageTableHeader from "../header"
import Details from "./details"
import CustomerGroupContext, {
  CustomerGroupContextContainer,
} from "./context/customer-group-context"
import CustomerGroupsTable from "../../../components/templates/customer-group-table/customer-groups-table"
import { Route, Routes } from "react-router-dom"

/*
 * Customer groups index page
 */
function Index() {
  const { showModal } = useContext(CustomerGroupContext)

  const actions = [
    {
      label: "New group",
      onClick: showModal,
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actions}
          customHeader={<CustomersPageTableHeader activeView="groups" />}
        >
          <CustomerGroupsTable />
        </BodyCard>
      </div>
    </div>
  )
}

/*
 * Customer groups routes
 */
function CustomerGroups() {
  return (
    <CustomerGroupContextContainer>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/:id" element={<Details />} />
      </Routes>
    </CustomerGroupContextContainer>
  )
}

export default CustomerGroups
