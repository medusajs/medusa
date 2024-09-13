import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, useForm, UseFormProps } from "react-hook-form"
import { z, ZodObject } from "zod"

import { FormConfigImport, FormConfigObject } from "./types"

interface UseExtendableFormProps<
  TSchema extends ZodObject<any>,
  TContext = any,
  TData = any
> extends Omit<UseFormProps<z.infer<TSchema>, TContext>, "resolver"> {
  schema: TSchema
  extensions?: FormConfigImport
  data?: TData
}

function createAdditionalDataSchema(configs: FormConfigObject[]) {
  return configs.reduce((acc, config) => {
    Object.entries(config).forEach(([key, { validation }]) => {
      acc[key] = validation
    })
    return acc
  }, {} as Record<string, z.ZodTypeAny>)
}

function createExtendedSchema<TSchema extends ZodObject<any>>(
  baseSchema: TSchema,
  additionalDataSchema: Record<string, z.ZodTypeAny>
) {
  return z.object({
    ...baseSchema.shape,
    additional_data: z.object(additionalDataSchema).optional(),
  })
}

function createExtendedDefaultValues<TData>(
  baseDefaultValues: any,
  configs: FormConfigObject[],
  data?: TData
) {
  const additional_data = configs.reduce((acc, config) => {
    Object.entries(config).forEach(([key, { defaultValue }]) => {
      acc[key] =
        typeof defaultValue === "function" ? defaultValue(data) : defaultValue
    })
    return acc
  }, {} as Record<string, any>)

  return Object.assign(baseDefaultValues, { additional_data })
}

export const useExtendableForm = <
  TSchema extends ZodObject<any>,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>({
  defaultValues: baseDefaultValues,
  schema: baseSchema,
  extensions,
  data,
  ...props
}: UseExtendableFormProps<TSchema, TContext>) => {
  const configs = extensions?.configs || []

  const additionalDataSchema = createAdditionalDataSchema(configs)
  const schema = createExtendedSchema(baseSchema, additionalDataSchema)
  const defaultValues = createExtendedDefaultValues(
    baseDefaultValues,
    configs,
    data
  )

  return useForm<z.infer<TSchema>, TContext, TTransformedValues>({
    ...props,
    defaultValues,
    resolver: zodResolver(schema),
  })
}
