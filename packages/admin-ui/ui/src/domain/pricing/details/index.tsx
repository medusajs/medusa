import { useAdminPriceList } from "medusa-react"
import { useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import RawJSON from "../../../components/organisms/raw-json"
import { mapPriceListToFormValues } from "../pricing-form/form/mappers"
import { PriceListFormProvider } from "../pricing-form/form/pricing-form-context"
import Header from "./sections/header"
import PricesDetails from "./sections/prices-details"

const PricingDetails = () => {
  const { id } = useParams()

  const { price_list, isLoading } = useAdminPriceList(id!)

  return (
    <div className="pb-large">
      <BackButton
        label="Back to Pricing"
        path="/a/pricing"
        className="mb-xsmall"
      />

      {!isLoading && price_list ? (
        <PriceListFormProvider priceList={mapPriceListToFormValues(price_list)}>
          <div className="gap-y-xsmall flex flex-col">
            <Header priceList={price_list} />

            <PricesDetails id={price_list?.id} />

            <RawJSON data={price_list} title="Raw price list" />
          </div>
        </PriceListFormProvider>
      ) : null}
    </div>
  )
}

export default PricingDetails
