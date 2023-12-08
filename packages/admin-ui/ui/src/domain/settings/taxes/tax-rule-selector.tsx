import React, { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import { LayeredModalContext } from "../../../components/molecules/modal/layered-modal"
import RadioGroup from "../../../components/organisms/radio-group"
import { ProductSelector } from "./product-selector"
import { ProductTypeSelector } from "./product-type-selector"
import { ShippingOptionSelector } from "./shipping-option-selector"

enum TaxRuleType {
  PRODUCTS = "products",
  PRODUCT_TYPES = "product_types",
  SHIPPING_OPTIONS = "shipping_options",
}

type TaxRuleSelectorProps = {
  regionId: string
  onSubmit: (rule) => void
  selectedItems?: any
  type?: TaxRuleType
  items?: string[]
}

type TaxRuleSet = {
  type: TaxRuleType
  items: string[]
}

const TaxRuleSelector: React.FC<TaxRuleSelectorProps> = ({
  regionId,
  type,
  items,
  onSubmit,
}) => {
  const isLocked = type && items
  const { t } = useTranslation()

  const { pop } = useContext(LayeredModalContext)
  const [selectedType, setSelectedType] = useState<string>(
    type ?? TaxRuleType.PRODUCTS
  )
  const [selectedRule, setSelectedRule] = useState<TaxRuleSet>({
    type: type ?? TaxRuleType.PRODUCTS,
    items: items ?? [],
  })

  const handleSubmit = () => {
    onSubmit(selectedRule)
    pop()
  }

  const handleTypeChange = (t) => {
    if (t !== selectedType) {
      setSelectedType(t)
      setSelectedRule({
        type: t,
        items: [],
      })
    }
  }

  const handleItemChanges = (items) => {
    setSelectedRule((prev) => {
      return {
        ...prev,
        items,
      }
    })
  }

  return (
    <>
      <Modal.Content>
        <div className="min-h-[680px]">
          {!isLocked && (
            <>
              <div className="inter-base-semibold mb-large">
                {t("taxes-type", "Type")}
              </div>
              <RadioGroup.Root
                className="gap-base flex"
                value={selectedType}
                onValueChange={handleTypeChange}
              >
                <RadioGroup.Item
                  className="flex-1"
                  label={t("taxes-products", "Products")}
                  description={t(
                    "taxes-select-individual-products",
                    "Select individual products"
                  )}
                  value={TaxRuleType.PRODUCTS}
                />
                <RadioGroup.Item
                  className="flex-1"
                  label={t("taxes-product-types", "Product Types")}
                  description={t(
                    "taxes-select-product-types",
                    "Select product types"
                  )}
                  value={TaxRuleType.PRODUCT_TYPES}
                />
                <RadioGroup.Item
                  className="flex-1"
                  label={t("taxes-shipping-options", "Shipping Options")}
                  description={t(
                    "taxes-select-shipping-options",
                    "Select shipping options"
                  )}
                  value={TaxRuleType.SHIPPING_OPTIONS}
                />
              </RadioGroup.Root>
            </>
          )}
          {selectedType === TaxRuleType.PRODUCTS && (
            <ProductSelector
              items={selectedRule.items}
              onChange={handleItemChanges}
            />
          )}
          {selectedType === TaxRuleType.PRODUCT_TYPES && (
            <ProductTypeSelector
              items={selectedRule.items}
              onChange={handleItemChanges}
            />
          )}
          {selectedType === TaxRuleType.SHIPPING_OPTIONS && (
            <ShippingOptionSelector
              regionId={regionId}
              items={selectedRule.items}
              onChange={handleItemChanges}
            />
          )}
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full justify-end">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
          >
            {t("taxes-back", "Back")}
          </Button>
          <Button
            variant="primary"
            className="w-[112px]"
            size="small"
            onClick={handleSubmit}
          >
            {t("taxes-add", "Add")}
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default TaxRuleSelector
