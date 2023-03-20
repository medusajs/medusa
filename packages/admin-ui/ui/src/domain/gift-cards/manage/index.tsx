import { Product } from "@medusajs/medusa"
import { useAdminProducts } from "medusa-react"
import { useNavigate } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import { getErrorStatus } from "../../../utils/get-error-status"
import AttributesSection from "./sections/attributes"
import Denominations from "./sections/denominations"
import GeneralSection from "./sections/general"
import MediaSection from "./sections/media"
import RawSection from "./sections/raw"
import ThumbnailSection from "./sections/thumbnail"

const Manage = () => {
  const navigate = useNavigate()

  const { products, error } = useAdminProducts(
    {
      is_giftcard: true,
    },
    {
      keepPreviousData: true,
    }
  )

  const giftCard = products?.[0] as Product | undefined

  if (!giftCard) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner variant="secondary" size="large" />
      </div>
    )
  }

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

  return (
    <div className="pb-5xlarge">
      <BackButton
        path="/a/products"
        label="Back to Gift Cards"
        className="mb-xsmall"
      />
      <div className="gap-x-base grid grid-cols-12">
        <div className="gap-y-xsmall col-span-8 flex flex-col">
          <GeneralSection product={giftCard} />
          <Denominations giftCard={giftCard} />
          <AttributesSection product={giftCard} />
          <RawSection product={giftCard} />
        </div>
        <div className="gap-y-xsmall col-span-4 flex flex-col">
          <ThumbnailSection product={giftCard} />
          <MediaSection product={giftCard} />
        </div>
      </div>
    </div>
  )
}

export default Manage
