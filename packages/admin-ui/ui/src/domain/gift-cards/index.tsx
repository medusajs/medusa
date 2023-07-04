import { Route, Routes } from "react-router-dom"
import GiftCardDetails from "./details"
import ManageGiftCard from "./manage"
import Overview from "./overview"

const GiftCard = () => {
  return (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/:id" element={<GiftCardDetails />} />
      <Route path="/manage" element={<ManageGiftCard />} />
    </Routes>
  )
}

export default GiftCard
