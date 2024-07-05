import { Drawer } from "@medusajs/ui"
import { PropsWithChildren, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RouteForm } from "../route-form"
import { RouteModalProvider } from "../route-modal-provider/route-provider"

type RouteDrawerProps = PropsWithChildren<{
  prev?: string
}>

const Root = ({ prev = "..", children }: RouteDrawerProps) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  /**
   * Open the modal when the component mounts. This
   * ensures that the entry animation is played.
   */
  useEffect(() => {
    setOpen(true)
  }, [])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      document.body.style.pointerEvents = "auto"
      navigate(prev, { replace: true })
      return
    }

    setOpen(open)
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <RouteModalProvider prev={prev}>
        <Drawer.Content>{children}</Drawer.Content>
      </RouteModalProvider>
    </Drawer>
  )
}

const Header = Drawer.Header
const Body = Drawer.Body
const Footer = Drawer.Footer
const Close = Drawer.Close
const Form = RouteForm

/**
 * Drawer that is used to render a form on a separate route.
 *
 * Typically used for forms editing a resource.
 */
export const RouteDrawer = Object.assign(Root, {
  Header,
  Body,
  Footer,
  Close,
  Form,
})
