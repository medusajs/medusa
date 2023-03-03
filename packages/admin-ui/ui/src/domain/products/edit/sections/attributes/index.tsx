import { Product } from "@medusajs/medusa"
import React from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import AttributeModal from "./attribute-modal"

type Props = {
  product: Product
}

const AttributesSection = ({ product }: Props) => {
  const { state, toggle, close } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit Attributes",
      onClick: toggle,
      icon: <EditIcon size={20} />,
    },
  ]

  return (
    <>
      <Section title="Attributes" actions={actions} forceDropdown>
        <div className="flex flex-col gap-y-xsmall mb-large mt-base">
          <h2 className="inter-base-semibold">Dimensions</h2>
          <div className="flex flex-col gap-y-xsmall">
            <Attribute attribute="Height" value={product.height} />
            <Attribute attribute="Width" value={product.width} />
            <Attribute attribute="Length" value={product.length} />
            <Attribute attribute="Weight" value={product.weight} />
          </div>
        </div>
        <div className="flex flex-col gap-y-xsmall">
          <h2 className="inter-base-semibold">Customs</h2>
          <div className="flex flex-col gap-y-xsmall">
            <Attribute attribute="MID Code" value={product.mid_code} />
            <Attribute attribute="HS Code" value={product.hs_code} />
            <Attribute
              attribute="Country of origin"
              value={product.origin_country}
            />
          </div>
        </div>
      </Section>

      <AttributeModal onClose={close} open={state} product={product} />
    </>
  )
}

type AttributeProps = {
  attribute: string
  value: string | number | null
}

const Attribute = ({ attribute, value }: AttributeProps) => {
  return (
    <div className="flex items-center justify-between w-full inter-base-regular text-grey-50">
      <p>{attribute}</p>
      <p>{value || "–"}</p>
    </div>
  )
}

export default AttributesSection
