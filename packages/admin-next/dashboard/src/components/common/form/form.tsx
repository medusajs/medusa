import { InformationCircleSolid } from "@medusajs/icons"
import {
  Hint as HintComponent,
  Label as LabelComponent,
  Text,
  Tooltip,
  clx,
} from "@medusajs/ui"
import * as LabelPrimitives from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import React, {
  ReactNode,
  createContext,
  forwardRef,
  useContext,
  useId,
} from "react"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form"
import { useTranslation } from "react-i18next"

const Provider = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>(
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

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
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

const Item = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div
          ref={ref}
          className={clx("flex flex-col space-y-2", className)}
          {...props}
        />
      </FormItemContext.Provider>
    )
  }
)
Item.displayName = "Form.Item"

const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root> & {
    optional?: boolean
    tooltip?: ReactNode
    icon?: ReactNode
  }
>(({ className, optional = false, tooltip, icon, ...props }, ref) => {
  const { formItemId } = useFormField()
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-x-1">
      <LabelComponent
        ref={ref}
        className={clx(className)}
        htmlFor={formItemId}
        size="small"
        weight="plus"
        {...props}
      />
      {tooltip && (
        <Tooltip content={tooltip}>
          <InformationCircleSolid className="text-ui-fg-muted" />
        </Tooltip>
      )}
      {icon}
      {optional && (
        <Text size="small" leading="compact" className="text-ui-fg-muted">
          ({t("fields.optional")})
        </Text>
      )}
    </div>
  )
})
Label.displayName = "Form.Label"

const Control = forwardRef<
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

const Hint = forwardRef<
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

const ErrorMessage = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formErrorMessageId } = useFormField()
  const msg = error ? String(error?.message) : children

  if (!msg || msg === "undefined") {
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
