import { Route, Routes, useLocation } from "react-router-dom"
import Edit from "./edit"
import Overview from "./overview"

const ProductsRoute = () => {
  const location = useLocation()

  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route key={location.key} path="/:id" element={<Edit />} />
    </Routes>
  )
}

export default ProductsRoute
