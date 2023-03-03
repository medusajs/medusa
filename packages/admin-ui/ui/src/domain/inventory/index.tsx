import { Route, Routes } from "react-router-dom"
import InventoryView from "./inventory"
import Locations from "./locations"

const Inventory = () => {
  return (
    <Routes>
      <Route index element={<InventoryView />} />
      <Route path="/locations/*" element={<Locations />} />
    </Routes>
  )
}

export default Inventory
