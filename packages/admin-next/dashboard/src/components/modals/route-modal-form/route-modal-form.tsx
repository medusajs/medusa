import { Prompt } from "@medusajs/ui"
import { PropsWithChildren } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useBlocker } from "react-router-dom"
import { Form } from "../../common/form"

type RouteModalFormProps<TFieldValues extends FieldValues> = PropsWithChildren<{
  form: UseFormReturn<TFieldValues>
  blockSearch?: boolean
  onClose?: (isSubmitSuccessful: boolean) => void
}>

export const RouteModalForm = <TFieldValues extends FieldValues = any>({
  form,
  blockSearch = false,
  children,
  onClose,
}: RouteModalFormProps<TFieldValues>) => {
  const { t } = useTranslation()

  const {
    formState: { isDirty },
  } = form

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const { isSubmitSuccessful } = nextLocation.state || {}

    if (isSubmitSuccessful) {
      onClose?.(true)
      return false
    }

    const isPathChanged = currentLocation.pathname !== nextLocation.pathname
    const isSearchChanged = currentLocation.search !== nextLocation.search

    if (blockSearch) {
      return isDirty && (isPathChanged || isSearchChanged)
    }

    return isDirty && isPathChanged
  })

  const handleCancel = () => {
    blocker?.reset?.()
  }

  const handleContinue = () => {
    blocker?.proceed?.()
    onClose?.(false)
  }

  return (
    <Form {...form}>
      {children}
      <Prompt open={blocker.state === "blocked"} variant="confirmation">
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>{t("general.unsavedChangesTitle")}</Prompt.Title>
            <Prompt.Description>
              {t("general.unsavedChangesDescription")}
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={handleCancel} type="button">
              {t("actions.cancel")}
            </Prompt.Cancel>
            <Prompt.Action onClick={handleContinue} type="button">
              {t("actions.continue")}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </Form>
  )
}
