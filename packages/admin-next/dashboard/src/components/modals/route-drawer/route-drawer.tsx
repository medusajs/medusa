import { Drawer, clx } from "@medusajs/ui"
import { PropsWithChildren, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RouteModalForm } from "../route-modal-form"
import { RouteModalProvider } from "../route-modal-provider/route-provider"
import { StackedModalProvider } from "../stacked-modal-provider"

type RouteDrawerProps = PropsWithChildren<{
  prev?: string
}>

const Root = ({ prev = "..", children }: RouteDrawerProps) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [stackedModalOpen, onStackedModalOpen] = useState(false)

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
        <StackedModalProvider onOpenChange={onStackedModalOpen}>
          <Drawer.Content
            className={clx({
              "!right-5": stackedModalOpen,
            })}
          >
            {children}
          </Drawer.Content>
        </StackedModalProvider>
      </RouteModalProvider>
    </Drawer>
  )
}

const Header = Drawer.Header
const Title = Drawer.Title
const Description = Drawer.Description
const Body = Drawer.Body
const Footer = Drawer.Footer
const Close = Drawer.Close
const Form = RouteModalForm

/**
 * Drawer that is used to render a form on a separate route.
 *
 * Typically used for forms editing a resource.
 */
export const RouteDrawer = Object.assign(Root, {
  Header,
  Title,
  Body,
  Description,
  Footer,
  Close,
  Form,
})
