import { Customer, Region } from "@medusajs/medusa"
import { FieldArrayWithId, UseFormReturn } from "react-hook-form"
import { z } from "zod"

import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
import {
  CreateDraftOrderSchema,
  CustomItemSchema,
  ExistingItemSchema,
  ShippingMethodSchema,
  View,
} from "./constants"

export type ExistingItem = z.infer<typeof ExistingItemSchema>
export type CustomItem = z.infer<typeof CustomItemSchema>
export type ShippingMethod = z.infer<typeof ShippingMethodSchema>

export type CreateDraftOrderContextValue = {
  form: UseFormReturn<z.infer<typeof CreateDraftOrderSchema>>
  region: Region | null
  setRegion: (region: Region | null) => void
  customer: Customer | null
  setCustomer: (customer: Customer | null) => void
  sameAsShipping: boolean
  setSameAsShipping: (sameAsShipping: boolean) => void
  variants: {
    items: FieldArrayWithId<
      z.infer<typeof CreateDraftOrderSchema>,
      "existing_items",
      "ei_id"
    >[]
    remove: (index: number) => void
    update: (items: ExistingItem[]) => void
    rebase: (variants: PricedVariant[]) => void
  }
  custom: {
    items: FieldArrayWithId<
      z.infer<typeof CreateDraftOrderSchema>,
      "custom_items",
      "ci_id"
    >[]
    remove: (index: number) => void
    update: (items: CustomItem) => void
  }
  onOpenDrawer: (view: View) => void
}
