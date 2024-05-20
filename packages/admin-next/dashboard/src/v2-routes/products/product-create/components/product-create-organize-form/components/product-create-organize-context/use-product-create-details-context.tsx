import { useContext } from "react"
import { ProductCreateDetailsContext } from "./product-create-details-context"

export const useProductCreateDetailsContext = () => {
  const context = useContext(ProductCreateDetailsContext)

  if (!context) {
    throw new Error(
      "useProductCreateDetailsContext must be used within a ProductCreateDetailsContextProvider"
    )
  }

  return context
}
