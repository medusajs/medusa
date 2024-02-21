import { usePrompt } from "@medusajs/ui"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

/**
 * Hook for managing the state of route modals.
 */
export const useRouteModalState = (): [
  open: boolean,
  onOpenChange: (open: boolean, ignore?: boolean) => void,
  /**
   * Subscribe to the dirty state of the form.
   * If the form is dirty, the modal will prompt
   * the user before closing.
   */
  subscribe: (value: boolean) => void,
] => {
  const [open, setOpen] = useState(false)
  const [shouldPrompt, subscribe] = useState(false)

  const navigate = useNavigate()
  const prompt = usePrompt()
  const { t } = useTranslation()

  const promptValues = useMemo(
    () => ({
      title: t("general.unsavedChangesTitle"),
      description: t("general.unsavedChangesDescription"),
      cancelText: t("actions.cancel"),
      confirmText: t("actions.continue"),
      variant: "confirmation" as const,
    }),
    [t]
  )

  useEffect(() => {
    setOpen(true)
  }, [])

  const onOpenChange = async (open: boolean, ignore = false) => {
    if (!open) {
      document.body.style.pointerEvents = "auto"
      navigate("..", { replace: true })
      return
    }

    setOpen(open)
  }

  return [open, onOpenChange, subscribe]
}
