import { Route, Routes } from "react-router-dom"
import Edit from "./edit"
import Overview from "./overview"

const ProductsRoute = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="/:id" element={<Edit />} />
    </Routes>
  )
}

export default ProductsRoute
