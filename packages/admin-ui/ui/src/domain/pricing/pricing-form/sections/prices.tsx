import { Product } from "@medusajs/medusa"
import { useAdminPriceListProducts } from "medusa-react"
import * as React from "react"
import { useTranslation } from "react-i18next"
import Accordion from "../../../../components/organisms/accordion"
import { merge } from "../../details/sections/prices-details/utils"
import ProductPrices from "./product-prices"

type PricesSectionProps = {
  isEdit?: boolean
  id?: string
}

const defaultQueryFilters = {
  limit: 50,
  offset: 0,
}

const PricesSection = ({ isEdit = false, id }: PricesSectionProps) => {
  const { t } = useTranslation()
  const {
    products = [],
    isInitialLoading,
    isLoading,
  } = useAdminPriceListProducts(id!, defaultQueryFilters, {
    enabled: isEdit,
  })

  const [selectedProducts, setSelectedProducts] = React.useState<Product[]>([])
  const mergedProducts = merge(products, selectedProducts)

  return (
    <Accordion.Item
      forceMountContent
      required
      value="prices"
      title={t("sections-prices", "Prices")}
      description={t(
        "sections-you-will-be-able-to-override-the-prices-for-the-products-you-add-here",
        "You will be able to override the prices for the products you add here"
      )}
      tooltip={t(
        "sections-define-the-price-overrides-for-the-price-list",
        "Define the price overrides for the price list"
      )}
    >
      <ProductPrices
        products={mergedProducts}
        isLoading={isEdit ? isLoading : isInitialLoading}
        setProducts={setSelectedProducts}
        onFileChosen={console.log}
      />
    </Accordion.Item>
  )
}

export default PricesSection
