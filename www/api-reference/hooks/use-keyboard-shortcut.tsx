import { useCallback, useEffect } from "react"
import { usePageLoading } from "../providers/page-loading"

type useKeyboardShortcutOptions = {
  metakey?: boolean
  shortcutKey: string
  action: () => void
  checkEditing?: boolean
}

const useKeyboardShortcut = ({
  metakey = true,
  shortcutKey,
  action,
  checkEditing = true,
}: useKeyboardShortcutOptions) => {
  const { isLoading } = usePageLoading()

  function isEditingContent(event: KeyboardEvent) {
    const element = event.target as HTMLElement
    const tagName = element.tagName
    return (
      element.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "SELECT" ||
      tagName === "TEXTAREA"
    )
  }

  const sidebarShortcut = useCallback(
    (e: KeyboardEvent) => {
      if (isLoading) {
        return
      }
      if (
        (!metakey || e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === shortcutKey.toLowerCase() &&
        (!checkEditing || !isEditingContent(e))
      ) {
        e.preventDefault()
        action()
      }
    },
    [isLoading, action, shortcutKey, metakey]
  )

  useEffect(() => {
    window.addEventListener("keydown", sidebarShortcut)

    return () => {
      window.removeEventListener("keydown", sidebarShortcut)
    }
  }, [sidebarShortcut])
}

export default useKeyboardShortcut
