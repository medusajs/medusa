import { Route, Routes, useNavigate } from "react-router-dom"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
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

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actionables}
          customHeader={<TableViewHeader views={["Price lists"]} />}
          className="h-fit"
        >
          <PricingTable />
        </BodyCard>
      </div>
    </div>
  )
}

const Pricing = () => {
  return (
    <Routes>
      <Route index element={<PricingIndex />} />
      <Route path="/new" element={<New />} />
      <Route path="/:id" element={<PricingDetails />} />
    </Routes>
  )
}

export default Pricing
