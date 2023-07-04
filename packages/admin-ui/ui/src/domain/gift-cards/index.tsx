import { Route, Routes } from "react-router-dom"
import RouteContainer from "../../components/extensions/route-container"
import { useRoutes } from "../../providers/route-provider"
import GiftCardDetails from "./details"
import ManageGiftCard from "./manage"
import Overview from "./overview"

const GiftCard = () => {
  const { getNestedRoutes } = useRoutes()

  const nestedRoutes = getNestedRoutes("/gift-cards")

  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/:id" element={<GiftCardDetails />} />
      <Route path="/manage" element={<ManageGiftCard />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={"/gift-cards"} />}
          />
        )
      })}
    </Routes>
  )
}

export default GiftCard
