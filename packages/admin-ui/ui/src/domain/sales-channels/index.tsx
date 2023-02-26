import Details from "./pages/details"
import { Route, Routes } from "react-router-dom"

const SalesChannels = () => {
  return (
    <Routes>
      <Route index element={<Details />} />
      <Route path="/:id" element={<Details />} />
    </Routes>
  )
}

export default SalesChannels
