import { BellAlert } from "@medusajs/icons"
import { Drawer, Heading, IconButton } from "@medusajs/ui"
import { useEffect, useState } from "react"

export const Notifications = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <IconButton
          variant="transparent"
          className="text-ui-fg-muted hover:text-ui-fg-subtle"
        >
          <BellAlert />
        </IconButton>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>Notifications</Heading>
        </Drawer.Header>
        <Drawer.Body>Notifications will go here</Drawer.Body>
      </Drawer.Content>
    </Drawer>
  )
}
