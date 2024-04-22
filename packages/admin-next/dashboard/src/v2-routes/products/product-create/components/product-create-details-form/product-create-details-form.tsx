import { Heading, Text } from "@medusajs/ui"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Divider } from "../../../../../components/common/divider"
import { SplitView } from "../../../../../components/layout/split-view"
import { ProductCreateSchemaType } from "../../types"
import { ProductCreateAttributeSection } from "./components/product-create-details-attribute-section"
import { ProductCreateDetailsContext } from "./components/product-create-details-context"
import { ProductCreateGeneralSection } from "./components/product-create-details-general-section"
import { ProductCreateOrganizationSection } from "./components/product-create-details-organize-section"
import { ProductCreateVariantsSection } from "./components/product-create-details-variant-section"
import { ProductCreateSalesChannelDrawer } from "./components/product-create-sales-channel-drawer"

type ProductAttributesProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateDetailsForm = ({ form }: ProductAttributesProps) => {
  const [open, setOpen] = useState(false)

  return (
    <ProductCreateDetailsContext.Provider
      value={{ open, onOpenChange: setOpen }}
    >
      <SplitView open={open} onOpenChange={setOpen}>
        <SplitView.Content>
          <div className="flex flex-col items-center p-16">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8">
              <Header />
              <ProductCreateGeneralSection form={form} />
              <Divider />
              <ProductCreateVariantsSection form={form} />
              <Divider />
              <ProductCreateOrganizationSection form={form} />
              <Divider />
              <ProductCreateAttributeSection form={form} />
            </div>
          </div>
        </SplitView.Content>
        <SplitView.Drawer>
          <ProductCreateSalesChannelDrawer form={form} />
        </SplitView.Drawer>
      </SplitView>
    </ProductCreateDetailsContext.Provider>
  )
}

const Header = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col">
      <Heading>{t("products.create.header")}</Heading>
      <Text size="small" className="text-ui-fg-subtle">
        {t("products.create.hint")}
      </Text>
    </div>
  )
}
