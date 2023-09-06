import { Route, Routes } from "react-router-dom"
import Spacer from "../../components/atoms/spacer"
import BodyCard from "../../components/organisms/body-card"
import ProductsReviewsTable from "../../components/templates/product-reviews-table"

const ProductReviewIndex = () => {
  return (
    <div>
      <BodyCard className="h-fit">
        <ProductsReviewsTable />
      </BodyCard>
      <Spacer />
    </div>
  )
}

const ProductsReviewsRoute = () => {
  return (
    <Routes>
      <Route index element={<ProductReviewIndex />} />
    </Routes>
  )
}

export default ProductsReviewsRoute
