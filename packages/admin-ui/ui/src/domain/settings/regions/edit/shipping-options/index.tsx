import { Region } from "@medusajs/medusa"
import { useAdminShippingOptions } from "medusa-react"
import { useTranslation } from "react-i18next"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import ShippingOptionCard from "../../components/shipping-option-card"
import CreateShippingOptionModal from "./create-shipping-option-modal"

type Props = {
  region: Region
}

const ShippingOptions = ({ region }: Props) => {
  const { t } = useTranslation()
  const { shipping_options: shippingOptions } = useAdminShippingOptions({
    region_id: region.id,
    is_return: false,
  })

  const { state, toggle, close } = useToggleState()

  return (
    <>
      <Section
        title={t("shipping-options-shipping-options", "Shipping Options")}
        actions={[
          {
            label: t("shipping-options-add-option", "Add Option"),
            onClick: toggle,
          },
        ]}
      >
        <div className="gap-y-large flex flex-col">
          <p className="inter-base-regular text-grey-50">
            {t(
              "shipping-options-enter-specifics-about-available-regional-shipment-methods",
              "Enter specifics about available regional shipment methods."
            )}
          </p>
          <div className="gap-y-small flex flex-col">
            {shippingOptions?.map((option) => {
              return <ShippingOptionCard option={option} key={option.id} />
            })}
          </div>
        </div>
      </Section>
      <CreateShippingOptionModal open={state} onClose={close} region={region} />
    </>
  )
}

export default ShippingOptions
