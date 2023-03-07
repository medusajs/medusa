import { Route, Routes } from "react-router-dom"

import ProductCategoryIndex from "./pages"

const ProductCategories = () => {
  return (
    <Routes>
      <Route index element={<ProductCategoryIndex />} />
    </Routes>
  )
}

export default ProductCategories
