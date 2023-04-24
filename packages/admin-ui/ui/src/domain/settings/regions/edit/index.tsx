import { useAdminRegion } from "medusa-react"
import Spinner from "../../../../components/atoms/spinner"
import Section from "../../../../components/organisms/section"
import { useGetFulfillmentOptions } from "../../../../hooks/admin/fulfillment-providers"
import GeneralSection from "./general-section"
import ReturnShippingOptions from "./return-shipping-options"
import ShippingOptions from "./shipping-options"

type Props = {
  id?: string
}

const EditRegion = ({ id }: Props) => {
  const {
    region,
    isLoading: regionsLoading,
    isError,
  } = useAdminRegion(id!, {
    enabled: !!id,
  })

  const { fulfillment_options, isLoading: fulfillmentOptionsLoading } =
    useGetFulfillmentOptions({
      regionId: id!,
    })

  const showShippingOptions =
    !!fulfillment_options && fulfillment_options.length > 0

  if (regionsLoading || fulfillmentOptionsLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-grey-0 rounded-rounded border border-grey-20 flex flex-col gap-y-xsmall items-center justify-center w-full h-full text-center ">
        <h1 className="inter-large-semibold">Something went wrong...</h1>
        <p className="inter-base-regular text-grey-50">
          We can't find a region with that ID, use the menu to the left to
          select a region.
        </p>
      </div>
    )
  }

  if (!region) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-xsmall">
      <GeneralSection region={region} />
      {showShippingOptions && <ShippingOptions region={region} />}
      {showShippingOptions && <ReturnShippingOptions region={region} />}
    </div>
  )
}

export default EditRegion
