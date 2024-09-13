import { zodResolver } from "@hookform/resolvers/zod"
import { FieldValues, useForm, UseFormProps } from "react-hook-form"
import { z, ZodObject } from "zod"

type FormConfigExtension = {
  defaultValue: ((data: any) => any) | any
  validation: any
}

interface UseExtendableFormProps<
  TSchema extends ZodObject<any>,
  TContext = any,
  TData = any
> extends Omit<UseFormProps<z.infer<TSchema>, TContext>, "resolver"> {
  schema: TSchema
  extensions?: Record<string, FormConfigExtension>[]
  data?: TData
}

function createAdditionalDataSchema(
  extensions: Record<string, FormConfigExtension>[]
) {
  return extensions.reduce((acc, extension) => {
    Object.entries(extension).forEach(([key, { validation }]) => {
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
  extensions: Record<string, FormConfigExtension>[],
  data?: TData
) {
  return {
    ...baseDefaultValues,
    additional_data: extensions.reduce((acc, extension) => {
      Object.entries(extension).forEach(([key, { defaultValue }]) => {
        acc[key] =
          typeof defaultValue === "function" ? defaultValue(data) : defaultValue
      })
      return acc
    }, {} as Record<string, any>),
  }
}

export const useExtendableForm = <
  TSchema extends ZodObject<any>,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined
>({
  defaultValues: baseDefaultValues,
  schema: baseSchema,
  extensions = [],
  data,
  ...props
}: UseExtendableFormProps<TSchema, TContext>) => {
  const additionalDataSchema = createAdditionalDataSchema(extensions)
  const schema = createExtendedSchema(baseSchema, additionalDataSchema)
  const defaultValues = createExtendedDefaultValues(
    baseDefaultValues,
    extensions,
    data
  )

  return useForm<z.infer<typeof schema>, TContext, TTransformedValues>({
    resolver: zodResolver(schema),
    defaultValues,
    ...props,
  })
}
