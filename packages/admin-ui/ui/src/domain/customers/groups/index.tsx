import { Route, Routes } from "react-router-dom"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import CustomerGroupsTable from "../../../components/templates/customer-group-table/customer-groups-table"
import useToggleState from "../../../hooks/use-toggle-state"
import CustomersPageTableHeader from "../header"
import CustomerGroupModal from "./customer-group-modal"
import Details from "./details"

/*
 * Customer groups index page
 */
function Index() {
  const { state, open, close } = useToggleState()

  const actions = [
    {
      label: "New group",
      onClick: open,
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  return (
    <>
      <div className="flex h-full grow flex-col">
        <BodyCard
          actionables={actions}
          className="h-auto"
          customHeader={<CustomersPageTableHeader activeView="groups" />}
        >
          <CustomerGroupsTable />
        </BodyCard>
      </div>
      <CustomerGroupModal open={state} onClose={close} />
    </>
  )
}

/*
 * Customer groups routes
 */
function CustomerGroups() {
  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="/:id" element={<Details />} />
    </Routes>
  )
}

export default CustomerGroups
