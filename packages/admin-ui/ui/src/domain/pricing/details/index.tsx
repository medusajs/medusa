import { useAdminPriceList } from "medusa-react"
import { useNavigate, useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import Spinner from "../../../components/atoms/spinner"
import WidgetContainer from "../../../components/extensions/widget-container"
import RawJSON from "../../../components/organisms/raw-json"
import { useWidgets } from "../../../providers/widget-provider"
import { getErrorStatus } from "../../../utils/get-error-status"
import { mapPriceListToFormValues } from "../pricing-form/form/mappers"
import { PriceListFormProvider } from "../pricing-form/form/pricing-form-context"
import Header from "./sections/header"
import PricesDetails from "./sections/prices-details"

const PricingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { price_list, isLoading, error } = useAdminPriceList(id!)
  const { getWidgets } = useWidgets()

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

  if (isLoading || !price_list) {
    return (
      <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
        <Spinner variant="secondary" />
      </div>
    )
  }

  return (
    <div className="pb-large">
      <BackButton
        label="Back to Pricing"
        path="/a/pricing"
        className="mb-xsmall"
      />
      <PriceListFormProvider priceList={mapPriceListToFormValues(price_list)}>
        <div className="gap-y-xsmall flex flex-col">
          {getWidgets("price_list.details.before").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                entity={price_list}
                injectionZone="price_list.details.before"
                widget={w}
              />
            )
          })}

          <Header priceList={price_list} />

          <PricesDetails id={price_list?.id} />

          {getWidgets("price_list.details.after").map((w, i) => {
            return (
              <WidgetContainer
                key={i}
                entity={price_list}
                injectionZone="price_list.details.after"
                widget={w}
              />
            )
          })}

          <RawJSON data={price_list} title="Raw price list" />
        </div>
      </PriceListFormProvider>
    </div>
  )
}

export default PricingDetails
