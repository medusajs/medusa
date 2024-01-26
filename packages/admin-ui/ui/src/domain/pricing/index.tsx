import { Route, Routes } from "react-router-dom"
import { PriceListEdit } from "./edit"
import { PriceListNew } from "./new"
import { PriceListOverview } from "./overview"

const PriceListRoute = () => {
  return (
    <Routes>
      <Route index element={<PriceListOverview />} />
      <Route path="new" element={<PriceListNew />} />
      <Route path=":id" element={<PriceListEdit />} />
    </Routes>
  )
}

export default PriceListRoute
