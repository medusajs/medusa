import { FocusModal, clx } from "@medusajs/ui"
import { PropsWithChildren, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { RouteModalForm } from "../route-modal-form"
import { RouteModalProvider } from "../route-modal-provider/route-provider"
import { StackedModalProvider } from "../stacked-modal-provider"

type RouteFocusModalProps = PropsWithChildren<{
  prev?: string
}>

const Root = ({ prev = "..", children }: RouteFocusModalProps) => {
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
    <FocusModal open={open} onOpenChange={handleOpenChange}>
      <RouteModalProvider prev={prev}>
        <StackedModalProvider onOpenChange={onStackedModalOpen}>
          <FocusModal.Content
            className={clx({
              "!inset-x-5 !inset-y-3": stackedModalOpen,
            })}
          >
            {children}
          </FocusModal.Content>
        </StackedModalProvider>
      </RouteModalProvider>
    </FocusModal>
  )
}

const Header = FocusModal.Header
const Title = FocusModal.Title
const Description = FocusModal.Description
const Footer = FocusModal.Footer
const Body = FocusModal.Body
const Close = FocusModal.Close
const Form = RouteModalForm

/**
 * FocusModal that is used to render a form on a separate route.
 *
 * Typically used for forms creating a resource or forms that require
 * a lot of space.
 */
export const RouteFocusModal = Object.assign(Root, {
  Header,
  Title,
  Body,
  Description,
  Footer,
  Close,
  Form,
})
