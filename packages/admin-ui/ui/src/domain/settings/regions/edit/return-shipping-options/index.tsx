import { Region } from "@medusajs/medusa"
import { useAdminShippingOptions } from "medusa-react"
import { useTranslation } from "react-i18next"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import ShippingOptionCard from "../../components/shipping-option-card"
import CreateReturnShippingOptionModal from "./create-return-shipping-option.modal"

type Props = {
  region: Region
}

const ReturnShippingOptions = ({ region }: Props) => {
  const { t } = useTranslation()
  const { shipping_options: returnShippingOptions } = useAdminShippingOptions({
    region_id: region.id,
    is_return: true,
  })

  const { state, toggle, close } = useToggleState()

  return (
    <>
      <Section
        title={t(
          "return-shipping-options-return-shipping-options",
          "Return Shipping Options"
        )}
        actions={[
          {
            label: t("return-shipping-options-add-option", "Add Option"),
            onClick: toggle,
          },
        ]}
      >
        <div className="gap-y-large flex flex-col">
          <p className="inter-base-regular text-grey-50">
            {t(
              "return-shipping-options-enter-specifics-about-available-regional-return-shipment-methods",
              "Enter specifics about available regional return shipment methods."
            )}
          </p>
          <div className="gap-y-small flex flex-col">
            {returnShippingOptions?.map((option) => {
              return <ShippingOptionCard option={option} key={option.id} />
            })}
          </div>
        </div>
      </Section>
      <CreateReturnShippingOptionModal
        onClose={close}
        open={state}
        region={region}
      />
    </>
  )
}

export default ReturnShippingOptions
