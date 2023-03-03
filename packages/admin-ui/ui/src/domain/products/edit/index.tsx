import { useAdminProduct } from "medusa-react"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import { getErrorStatus } from "../../../utils/get-error-status"
import AttributesSection from "./sections/attributes"
import GeneralSection from "./sections/general"
import MediaSection from "./sections/media"
import RawSection from "./sections/raw"
import ThumbnailSection from "./sections/thumbnail"
import VariantsSection from "./sections/variants"

const Edit = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { product, status, error } = useAdminProduct(id || "")

  if (error) {
    let message = "An unknown error occurred"

    const errorStatus = getErrorStatus(error)

    if (errorStatus) {
      message = errorStatus.message

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
    // temp, perhaps use skeletons?
    return (
      <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center">
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
      <div className="grid grid-cols-12 gap-x-base">
        <div className="col-span-8 flex flex-col gap-y-xsmall">
          <GeneralSection product={product} />
          <VariantsSection product={product} />
          <AttributesSection product={product} />
          <RawSection product={product} />
        </div>
        <div className="flex flex-col col-span-4 gap-y-xsmall">
          <ThumbnailSection product={product} />
          <MediaSection product={product} />
        </div>
      </div>
    </div>
  )
}

export default Edit
