import React from "react"
import { UseFormReturn } from "react-hook-form"

import { CreateProductVariantSchema } from "./constants"

type InventoryKitTabProps = {
  form: UseFormReturn<typeof CreateProductVariantSchema>
}

function InventoryKitTab({ form }: InventoryKitTabProps) {
  return <div>INVENTORY</div>
}

export default InventoryKitTab
