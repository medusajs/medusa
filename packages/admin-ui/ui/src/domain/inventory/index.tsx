import { Route, Routes } from "react-router-dom"
import InventoryView from "./inventory"
import Locations from "./locations"
import Reservations from "./reservations"
import {
  FeatureFlag,
  useFeatureFlag,
} from "../../providers/feature-flag-provider"

const Inventory = () => {
  const { isFeatureEnabled } = useFeatureFlag()
  const isReservationsEnabled =
    isFeatureEnabled(FeatureFlag.RESERVATIONS) &&
    isFeatureEnabled(FeatureFlag.INVENTORY)

  return (
    <Routes>
      <Route index element={<InventoryView />} />
      <Route path="/locations/*" element={<Locations />} />
      {isReservationsEnabled && (
        <Route path="/reservations/*" element={<Reservations />} />
      )}
    </Routes>
  )
}

export default Inventory
