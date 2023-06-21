import { Route, Routes } from "react-router-dom"

import InventoryView from "./inventory"
import Locations from "./locations"
import Reservations from "./reservations"

const Inventory = () => {
  return (
    <Routes>
      <Route index element={<InventoryView />} />
      <Route path="/locations/*" element={<Locations />} />
      <Route path="/reservations/*" element={<Reservations />} />
    </Routes>
  )
}

export default Inventory
