import { Route, Routes } from "react-router-dom"
import RouteContainer from "../../../components/extensions/route-container"
import WidgetContainer from "../../../components/extensions/widget-container"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../components/organisms/body-card"
import CustomerGroupsTable from "../../../components/templates/customer-group-table/customer-groups-table"
import useToggleState from "../../../hooks/use-toggle-state"
import { useRoutes } from "../../../providers/route-provider"
import { useWidgets } from "../../../providers/widget-provider"
import CustomersPageTableHeader from "../header"
import CustomerGroupModal from "./customer-group-modal"
import Details from "./details"
import { useTranslation } from "react-i18next"

/*
 * Customer groups index page
 */
function Index() {
  const { state, open, close } = useToggleState()
  const { getWidgets } = useWidgets()
  const { t } = useTranslation()

  const actions = [
    {
      label: t("groups-new-group", "New group"),
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
      <div className="gap-y-xsmall flex h-full grow flex-col">
        {getWidgets("customer_group.list.before").map((w, index) => {
          return (
            <WidgetContainer
              key={index}
              entity={null}
              widget={w}
              injectionZone="customer_group.list.before"
            />
          )
        })}

        <BodyCard
          actionables={actions}
          className="h-auto"
          customHeader={<CustomersPageTableHeader activeView="groups" />}
        >
          <CustomerGroupsTable />
        </BodyCard>

        {getWidgets("customer_group.list.after").map((w, index) => {
          return (
            <WidgetContainer
              key={index}
              entity={null}
              widget={w}
              injectionZone="customer_group.list.after"
            />
          )
        })}
      </div>
      <CustomerGroupModal open={state} onClose={close} />
    </>
  )
}

/*
 * Customer groups routes
 */
function CustomerGroups() {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/customers/groups")

  return (
    <Routes>
      <Route index element={<Index />} />
      <Route path="/:id" element={<Details />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={
              <RouteContainer route={r} previousPath={"/customers/groups"} />
            }
          />
        )
      })}
    </Routes>
  )
}

export default CustomerGroups
