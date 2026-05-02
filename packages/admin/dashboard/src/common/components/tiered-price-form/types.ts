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

export interface TieredPriceSchema extends z.ZodType<{
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
  renderInput: (props: {
    field: any
    value: any
  }) => ReactNode
}
