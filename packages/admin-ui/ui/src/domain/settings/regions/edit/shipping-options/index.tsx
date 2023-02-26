import { Region } from "@medusajs/medusa"
import { useAdminShippingOptions } from "medusa-react"
import React from "react"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import ShippingOptionCard from "../../components/shipping-option-card"
import CreateShippingOptionModal from "./create-shipping-option-modal"

type Props = {
  region: Region
}

const ShippingOptions = ({ region }: Props) => {
  const { shipping_options: shippingOptions } = useAdminShippingOptions({
    region_id: region.id,
    is_return: false,
  })

  const { state, toggle, close } = useToggleState()

  return (
    <>
      <Section
        title="Shipping Options"
        actions={[
          {
            label: "Add Option",
            onClick: toggle,
          },
        ]}
      >
        <div className="flex flex-col gap-y-large">
          <p className="inter-base-regular text-grey-50">
            Enter specifics about available regional shipment methods.
          </p>
          <div className="flex flex-col gap-y-small">
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
