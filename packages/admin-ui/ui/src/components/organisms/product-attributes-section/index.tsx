import { Product } from "@medusajs/medusa"
import { useTranslation } from "react-i18next"
import useToggleState from "../../../hooks/use-toggle-state"
import EditIcon from "../../fundamentals/icons/edit-icon"
import { ActionType } from "../../molecules/actionables"
import Section from "../section"
import AttributeModal from "./attribute-modal"

type Props = {
  product: Product
}

const ProductAttributesSection = ({ product }: Props) => {
  const { t } = useTranslation()
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
      <Section
        title={t("product-attributes-section-title", "Attributes")}
        actions={actions}
        forceDropdown
      >
        <div className="gap-y-xsmall mb-large mt-base flex flex-col">
          <h2 className="inter-base-semibold">
            {t("product-attributes-section-dimensions", "Dimensions")}
          </h2>
          <div className="gap-y-xsmall flex flex-col">
            <Attribute
              attribute={t("product-attributes-section-height", "Height")}
              value={product.height}
            />
            <Attribute
              attribute={t("product-attributes-section-width", "Width")}
              value={product.width}
            />
            <Attribute
              attribute={t("product-attributes-section-length", "Length")}
              value={product.length}
            />
            <Attribute
              attribute={t("product-attributes-section-weight", "Weight")}
              value={product.weight}
            />
          </div>
        </div>
        <div className="gap-y-xsmall flex flex-col">
          <h2 className="inter-base-semibold">
            {t("product-attributes-section-customs", "Customs")}
          </h2>
          <div className="gap-y-xsmall flex flex-col">
            <Attribute
              attribute={t("product-attributes-section-mid-code", "MID Code")}
              value={product.mid_code}
            />
            <Attribute
              attribute={t("product-attributes-section-hs-code", "HS Code")}
              value={product.hs_code}
            />
            <Attribute
              attribute={t(
                "product-attributes-section-country-of-origin",
                "Country of origin"
              )}
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
    <div className="inter-base-regular text-grey-50 flex w-full items-center justify-between">
      <p>{attribute}</p>
      <p>{value || "–"}</p>
    </div>
  )
}

export default ProductAttributesSection
