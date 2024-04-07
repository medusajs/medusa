import { UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { View } from "./constants"
import { CreatePromotionSchema } from "./form-schema"

export type CreateDraftOrderContextValue = {
  form: UseFormReturn<z.infer<typeof CreatePromotionSchema>>
  onOpenDrawer: (view: View) => void
}
