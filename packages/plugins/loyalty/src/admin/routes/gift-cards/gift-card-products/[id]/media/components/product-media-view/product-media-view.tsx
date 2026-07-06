import { useSearchParams } from "react-router-dom"
import { EditProductMediaForm } from "../edit-product-media-form"
import { ProductMediaGallery } from "../product-media-gallery"
import { ProductMediaViewContext } from "./product-media-view-context"
import { HttpTypes } from "@medusajs/types"

type ProductMediaViewProps = {
  product: HttpTypes.AdminProduct
}

enum View {
  GALLERY = "gallery",
  EDIT = "edit",
}

const getView = (searchParams: URLSearchParams) => {
  const view = searchParams.get("view")
  if (view === View.EDIT) {
    return View.EDIT
  }

  return View.GALLERY
}

export const ProductMediaView = ({ product }: ProductMediaViewProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const view = getView(searchParams)

  const handleGoToView = (view: View) => {
    return () => {
      setSearchParams({ view })
    }
  }

  return (
    <ProductMediaViewContext.Provider
      value={{
        goToGallery: handleGoToView(View.GALLERY),
        goToEdit: handleGoToView(View.EDIT),
      }}
    >
      {renderView(view, product)}
    </ProductMediaViewContext.Provider>
  )
}

const renderView = (view: View, product: HttpTypes.AdminProduct) => {
  switch (view) {
    case View.GALLERY:
      return <ProductMediaGallery product={product} />
    case View.EDIT:
      return <EditProductMediaForm product={product} />
  }
}
