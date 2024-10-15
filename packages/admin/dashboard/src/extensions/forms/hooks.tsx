import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, useForm, UseFormProps } from "react-hook-form"
import { z, ZodEffects, ZodObject } from "zod"

import { ConfigField } from "../types"

interface UseExtendableFormProps<
  TSchema extends ZodObject<any> | ZodEffects<ZodObject<any>>,
  TContext = any,
  TData = any
> extends Omit<UseFormProps<z.infer<TSchema>, TContext>, "resolver"> {
  schema: TSchema
  configs: ConfigField[]
  data?: TData
}

function createAdditionalDataSchema(configs: ConfigField[]) {
  return configs.reduce((acc, config) => {
    acc[config.name] = config.validation
    return acc
  }, {} as Record<string, z.ZodTypeAny>)
}

function createExtendedSchema<
  TSchema extends ZodObject<any> | ZodEffects<ZodObject<any>>
>(baseSchema: TSchema, additionalDataSchema: Record<string, z.ZodTypeAny>) {
  const extendedObjectSchema = z.object({
    ...(baseSchema instanceof ZodEffects
      ? baseSchema.innerType().shape
      : baseSchema.shape),
    additional_data: z.object(additionalDataSchema).optional(),
  })

  return baseSchema instanceof ZodEffects
    ? baseSchema
        .superRefine((data, ctx) => {
          const result = extendedObjectSchema.safeParse(data)
          if (!result.success) {
            result.error.issues.forEach((issue) => ctx.addIssue(issue))
          }
        })
        .and(extendedObjectSchema)
    : extendedObjectSchema
}

function createExtendedDefaultValues<TData>(
  baseDefaultValues: any,
  configs: ConfigField[],
  data?: TData
) {
  const additional_data = configs.reduce((acc, config) => {
    const { name, defaultValue } = config

    acc[name] =
      typeof defaultValue === "function" ? defaultValue(data) : defaultValue
    return acc
  }, {} as Record<string, any>)

  return Object.assign(baseDefaultValues, { additional_data })
}

export const useExtendableForm = <
  TSchema extends ZodObject<any> | ZodEffects<ZodObject<any>>,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>({
  defaultValues: baseDefaultValues,
  schema: baseSchema,
  configs,
  data,
  ...props
}: UseExtendableFormProps<TSchema, TContext>) => {
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
