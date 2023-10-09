import {
  Hint as HintComponent,
  Label as LabelComponent,
  clx,
} from "@medusajs/ui"
import * as LabelPrimitives from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form"

const Provider = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const Field = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()

  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within a FormField")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formErrorMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

const Item = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={clx("flex flex-col space-y-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
})
Item.displayName = "Form.Item"

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root>
>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField()

  return (
    <LabelComponent
      ref={ref}
      className={clx(className)}
      htmlFor={formItemId}
      weight="plus"
      {...props}
    />
  )
})
Label.displayName = "Form.Label"

const Control = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formErrorMessageId } =
    useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formErrorMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
Control.displayName = "Form.Control"

const Hint = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <HintComponent
      ref={ref}
      id={formDescriptionId}
      className={className}
      {...props}
    />
  )
})
Hint.displayName = "Form.Hint"

const ErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formErrorMessageId } = useFormField()
  const msg = error ? String(error?.message) : children

  if (!msg) {
    return null
  }

  return (
    <HintComponent
      ref={ref}
      id={formErrorMessageId}
      className={className}
      variant={error ? "error" : "info"}
      {...props}
    >
      {msg}
    </HintComponent>
  )
})
ErrorMessage.displayName = "Form.ErrorMessage"

const Form = Object.assign(Provider, {
  Item,
  Label,
  Control,
  Hint,
  ErrorMessage,
  Field,
})

export { Form }
