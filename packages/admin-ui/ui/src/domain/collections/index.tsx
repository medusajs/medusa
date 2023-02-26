import { Route, Routes } from "react-router-dom"
import CollectionDetails from "./details"

const Collections = () => {
  return (
    <Routes>
      <Route path="/:id" element={<CollectionDetails />} />
    </Routes>
  )
}

export default Collections
