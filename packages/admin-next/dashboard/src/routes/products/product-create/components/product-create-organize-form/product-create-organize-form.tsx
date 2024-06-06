import { useState } from "react"
import { UseFormReturn } from "react-hook-form"

import { SplitView } from "../../../../../components/layout/split-view"
import { ProductCreateSchemaType } from "../../types"
import { ProductCreateDetailsContext } from "./components/product-create-organize-context"
import { ProductCreateOrganizationSection } from "./components/product-create-organize-section"
import { ProductCreateSalesChannelDrawer } from "./components/product-create-sales-channel-drawer"

type ProductAttributesProps = {
  form: UseFormReturn<ProductCreateSchemaType>
}

export const ProductCreateOrganizeForm = ({ form }: ProductAttributesProps) => {
  const [open, setOpen] = useState(false)

  return (
    <ProductCreateDetailsContext.Provider
      value={{ open, onOpenChange: setOpen }}
    >
      <SplitView open={open} onOpenChange={setOpen}>
        <SplitView.Content>
          <div className="flex flex-col items-center p-16">
            <div className="flex w-full max-w-[720px] flex-col gap-y-8">
              <ProductCreateOrganizationSection form={form} />

              {/* TODO: WHERE DO WE SET PRODUCT ATTRIBUTES? -> the plan is to moved that to Inventory UI */}
              {/* <Divider />*/}
              {/* <ProductCreateAttributeSection form={form} />*/}
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
