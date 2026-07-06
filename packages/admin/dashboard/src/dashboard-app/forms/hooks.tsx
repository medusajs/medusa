import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, useForm, UseFormProps } from "react-hook-form"
import { z, ZodObject } from "zod"

import { ConfigField } from "../types"

interface UseExtendableFormProps<
  TSchema extends ZodObject<any>,
  TContext = any,
  TData = any
> extends Omit<UseFormProps<z.infer<TSchema>, TContext>, "resolver"> {
  schema: TSchema | z.ZodPipe<TSchema, z.ZodType>
  configs: ConfigField[]
  data?: TData
}

function createAdditionalDataSchema(configs: ConfigField[]) {
  return configs.reduce((acc, config) => {
    acc[config.name] = config.validation
    return acc
  }, {} as Record<string, z.ZodTypeAny>)
}

/**
 * Extracts the shape from a schema, handling both ZodObject and ZodPipe.
 * ZodPipe is created by .transform() and wraps the original schema.
 */
function getSchemaShape(
  schema: ZodObject<any> | z.ZodPipe<ZodObject<any>, z.ZodType>
): z.ZodRawShape {
  if (schema instanceof z.ZodPipe) {
    const innerSchema = schema.def.in
    // Guard: ensure inner schema is a ZodObject before accessing shape
    if (innerSchema instanceof ZodObject) {
      return innerSchema.shape
    }
    throw new Error(
      "Expected ZodPipe to contain a ZodObject. Schema extensions require the base schema to be a ZodObject."
    )
  }
  return schema.shape
}

function createExtendedSchema(
  baseSchema: ZodObject<any> | z.ZodPipe<ZodObject<any>, z.ZodType>,
  additionalDataSchema: Record<string, z.ZodTypeAny>
) {
  const baseShape = getSchemaShape(baseSchema)

  const extendedObjectSchema = z.object({
    ...baseShape,
    additional_data: z.object(additionalDataSchema).optional(),
  })

  return baseSchema
    .superRefine((data, ctx) => {
      const result = extendedObjectSchema.safeParse(data)
      if (!result.success) {
        result.error.issues.forEach((issue) => ctx.addIssue({ ...issue }))
      }
    })
    .and(extendedObjectSchema)
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
  TSchema extends ZodObject<any>,
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
