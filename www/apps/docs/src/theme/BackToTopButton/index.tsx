import React from "react"
import clsx from "clsx"
import { translate } from "@docusaurus/Translate"
import { useBackToTopButton } from "@docusaurus/theme-common/internal"
import { Button, useNotifications } from "docs-ui"
import { ArrowUpMini } from "@medusajs/icons"

export default function BackToTopButton(): JSX.Element {
  const { shown, scrollToTop } = useBackToTopButton({ threshold: 300 })
  const { notifications } = useNotifications()

  return (
    <Button
      aria-label={translate({
        id: "theme.BackToTopButton.buttonAriaLabel",
        message: "Scroll back to top",
        description: "The ARIA label for the back to top button",
      })}
      className={clsx(
        "fixed right-1 rounded-full !p-[10px] !border-0",
        "shadow-flyout dark:shadow-flyout-dark !text-medusa-fg-subtle",
        "!transition-all opacity-0 scale-0 invisible",
        shown && "!opacity-100 !scale-100 !visible",
        notifications.length && "bottom-4",
        !notifications.length && "bottom-1"
      )}
      variant="secondary"
      onClick={scrollToTop}
    >
      <ArrowUpMini />
    </Button>
  )
}
