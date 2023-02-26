
import { get } from "lodash"
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"
import { Get } from "type-fest"

export type NestedForm<TValues extends FieldValues> = UseFormReturn<{ __nested__: TValues }> & {
  path(this: void): `__nested__`
  path<TPath extends FieldPath<TValues>>(
    this: void,
    p?: TPath
  ): `__nested__.${TPath}`
  get<TObj>(this: void, obj: TObj): Get<TObj, `__nested__`>
  get<TPath extends FieldPath<TValues>, TObj>(
    this: void,
    obj: TObj,
    p?: TPath
  ): Get<TObj, `__nested__.${TPath}`>
}
/**
 * Utility function to create a nested form. This is useful when you want to use a reusable form component within a form.
 * This is especially useful when you want to use a reusable form component within a form multiple times. For example, an form
 * that contains both a billing and a shipping address. 
 * @example
 * const MyForm = () => {
 *   const form = useForm<{ email: string, shipping_address: AddressPayload, billing_address: AddressPayload }>()
 * 
 *   return (
 *     <div>
 *       <Input {...form.register("email")} label="email" />
 *       <AddressForm form={nestedForm(form, "shipping_address")} />
 *       <AddressForm form={nestedForm(form, "billing_address")} />
 *     </div>
 *   )
 * }
 * 
 * type AddressFormProps = {
 *   form: NestedForm<AddressPayload>
 * }
 * 
 * const AddressForm = ({ form }: AddressFormProps) => {
 *   const { register, path } = form
 *   
 *   return (
 *     <div>
 *       <Input {...register(path("city"))} label="City" /> // path("city") resolves as "shipping_address.city" or "billing_address.city" depending on the second argument passed to nestedForm
 *       <Input {...register(path("postal_code"))} label="Postal Code" />
 *     </div>
 *   )
 * }
 */
export function nestedForm<TValues extends FieldValues>(
  form: UseFormReturn<TValues> | NestedForm<TValues>
): NestedForm<TValues>
export function nestedForm<TValues extends FieldValues, TPath extends FieldPath<TValues>>(
  form: UseFormReturn<TValues> | NestedForm<TValues>,
  path: TPath
): NestedForm<Get<TValues, TPath>>
export function nestedForm(
  form: UseFormReturn<any> | NestedForm<any>,
  path?: string | number
): NestedForm<any> {
  return {
    ...form,
    path(field?: string | number) {
      const fullPath = path && field ? `${path}.${field}` : path ? path : field
      
      if ("path" in form) {
        return form.path(path as any)
      }

      return (fullPath || "") as any
    },
    get(obj: any, field?: string | number) {
      const fullPath = path && field ? `${path}.${field}` : path ? path : field
      
      if ("get" in form) { 
        return form.get(path) 
      }
      
      return fullPath ? get(obj, fullPath) : obj
    },
  }
}