import type { ReactElement } from "react"
import type { FieldValues, UseFormReturn } from "react-hook-form"
import { useFormContext } from "react-hook-form"

interface ConnectedFormProps<TFieldValues extends FieldValues> {
  children(children: UseFormReturn<TFieldValues>): ReactElement
}

/**
 * Utility component for nested forms.
 */
const ConnectedForm = <TFieldValues extends FieldValues>({
  children,
}: ConnectedFormProps<TFieldValues>) => {
  const methods = useFormContext<TFieldValues>()

  return children({ ...methods })
}

export default ConnectedForm
