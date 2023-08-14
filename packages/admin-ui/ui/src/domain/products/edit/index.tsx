import { useAdminProduct } from "medusa-react"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import WidgetContainer from "../../../components/extensions/widget-container"
import ProductAttributesSection from "../../../components/organisms/product-attributes-section"
import ProductGeneralSection from "../../../components/organisms/product-general-section"
import ProductMediaSection from "../../../components/organisms/product-media-section"
import ProductRawSection from "../../../components/organisms/product-raw-section"
import ProductThumbnailSection from "../../../components/organisms/product-thumbnail-section"
import ProductVariantsSection from "../../../components/organisms/product-variants-section"
import { useWidgets } from "../../../providers/widget-provider"
import { getErrorStatus } from "../../../utils/get-error-status"

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { getWidgets } = useWidgets()

  const { product, status, error } = useAdminProduct(id || "")

  if (error) {
    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      // If the product is not found, redirect to the 404 page
      if (errorStatus.status === 404) {
        navigate("/404")
        return null
      }
    }

    // Let the error boundary handle the error
    throw error
  }

  if (status === "loading" || !product) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <div className="pb-5xlarge">
      <BackButton
        path="/a/products"
        label="Back to Products"
        className="mb-xsmall"
      />
      <div className="gap-y-xsmall flex flex-col">
        {getWidgets("product.details.before").map((w, i) => {
          return (
            <WidgetContainer
              key={i}
              injectionZone={"product.details.before"}
              widget={w}
              entity={product}
            />
          )
        })}
        <div className="gap-x-base grid grid-cols-12">
          <div className="gap-y-xsmall col-span-8 flex flex-col">
            <ProductGeneralSection product={product} />
            <ProductVariantsSection product={product} />
            <ProductAttributesSection product={product} />
            {getWidgets("product.details.after").map((w, i) => {
              return (
                <WidgetContainer
                  key={i}
                  injectionZone={"product.details.after"}
                  widget={w}
                  entity={product}
                />
              )
            })}
            <ProductRawSection product={product} />
          </div>
          <div className="gap-y-xsmall col-span-4 flex flex-col">
            <ProductThumbnailSection product={product} />
            <ProductMediaSection product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Edit
