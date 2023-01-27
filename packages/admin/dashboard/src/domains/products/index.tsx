import { useQuery } from "@tanstack/react-query"

const fetchProducts = async () => {
  const response = await fetch(`/store/products`)
  const data = await response.json()
  return data
}

const ProductsRoute = () => {
  const { data, isLoading } = useQuery(["products"], fetchProducts)
  return (
    <div>
      <h1>Products</h1>
      <div>{JSON.stringify(data, null, 2)}</div>
    </div>
  )
}

export default ProductsRoute
