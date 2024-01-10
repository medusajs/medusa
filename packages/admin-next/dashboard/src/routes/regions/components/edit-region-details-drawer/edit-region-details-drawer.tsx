import { Drawer } from "@medusajs/ui"
import { useState } from "react"

export const EditRegionDetailsDrawer = () => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild></Drawer.Trigger>
    </Drawer>
  )
}
