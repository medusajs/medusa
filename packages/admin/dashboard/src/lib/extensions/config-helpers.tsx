import { FieldValues, useForm, UseFormProps } from "react-hook-form"
import { ZodSchema } from "zod"

type FormConfigExtension = {
  defaultValue: ((data: any) => any) | any
  validation: any
}

interface UseExtendableFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
> extends UseFormProps<TFieldValues, TContext> {
  schema: ZodSchema
}

export const useExtendableForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>() => {
  return useForm<TFieldValues, TContext, TTransformedValues>({})
}
