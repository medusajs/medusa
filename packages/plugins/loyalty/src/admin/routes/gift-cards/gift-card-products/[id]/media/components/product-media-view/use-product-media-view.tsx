import { useContext } from "react"
import { ProductMediaViewContext } from "./product-media-view-context"

export const useProductMediaView = () => {
  const context = useContext(ProductMediaViewContext)

  if (!context) {
    throw new Error(
      "useProductMediaView must be used within a ProductMediaViewProvider"
    )
  }

  return context
}
