import { Route, Routes, useNavigate } from "react-router-dom"
import Spacer from "../../components/atoms/spacer"
import RouteContainer from "../../components/extensions/route-container"
import WidgetContainer from "../../components/extensions/widget-container"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import { useRoutes } from "../../providers/route-provider"
import { useWidgets } from "../../providers/widget-provider"
import PricingDetails from "./details"
import New from "./new"
import PricingTable from "./pricing-table"

const PricingIndex = () => {
  const navigate = useNavigate()

  const actionables = [
    {
      label: "Add price list",
      onClick: () => navigate(`/a/pricing/new`),
      icon: <PlusIcon size={20} />,
    },
  ]

  const { getWidgets } = useWidgets()

  return (
    <div className="gap-y-xsmall flex h-full flex-col">
      {getWidgets("price_list.list.before").map((w, index) => {
        return (
          <WidgetContainer
            key={index}
            widget={w}
            entity={null}
            injectionZone="price_list.list.before"
          />
        )
      })}
      <div className="flex w-full grow flex-col">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["Price lists"]} />}
          className="h-fit"
        >
          <PricingTable />
        </BodyCard>
        <Spacer />
      </div>
    </div>
  )
}

const Pricing = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/pricing")

  return (
    <Routes>
      <Route index element={<PricingIndex />} />
      <Route path="/new" element={<New />} />
      <Route path="/:id" element={<PricingDetails />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={"/pricing"} />}
          />
        )
      })}
    </Routes>
  )
}

export default Pricing
