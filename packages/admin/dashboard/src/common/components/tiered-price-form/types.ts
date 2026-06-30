import { ReactNode } from "react"
import { Control } from "react-hook-form"
import { z } from "zod"
import { CurrencyInfo } from "../../../lib/data/currencies"

export interface TieredPriceFieldConfig {
  min: string
  max: string
  minLabel: string
  maxLabel: string
}

export interface TieredPriceSchema
  extends z.ZodType<{
    prices: any[]
  }> {}

export interface TieredPriceFormProps<T extends TieredPriceSchema> {
  schema: T
  initialValues: z.infer<T>["prices"]
  onSubmit: (values: z.infer<T>) => void
  onClose: () => void
  currency: CurrencyInfo
  header: string
  description: string
  addPriceLabel: string
  fieldConfig: TieredPriceFieldConfig
  /**
   * Row used for the first (empty) tier and for each tier added via "Add
   * price". Lets the consumer control which condition inputs start expanded
   * (a field is expanded when its value differs from its inactive sentinel).
   * Falls back to `{ amount, [min]: "", [max]: null }` when omitted.
   */
  defaultRow?: z.infer<T>["prices"][number]
  renderConditionItem: (props: {
    index: number
    control: Control<z.infer<T>>
    currency: CurrencyInfo
  }) => ReactNode
  renderConditionTrigger: (props: {
    index: number
    control: Control<z.infer<T>>
    currency: CurrencyInfo
  }) => ReactNode
}

export interface TieredPriceInputProps {
  field: any
  label: string
  toggleValues: {
    active: any
    inactive: any
  }
  renderInput: (props: { field: any; value: any }) => ReactNode
}
