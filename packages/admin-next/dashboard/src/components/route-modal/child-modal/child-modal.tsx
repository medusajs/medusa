import { FocusModal, clx } from "@medusajs/ui"
import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  forwardRef,
  useEffect,
} from "react"
import { useChildModal } from "./hooks"

type ChildModalProps = PropsWithChildren<{
  /**
   * A unique identifier for the modal. This is used to differentiate child modals,
   * when multiple child modals are registered to the same parent modal.
   */
  id: string
}>

/**
 * A child modal that can be rendered within a parent modal.
 */
export const Root = ({ id, children }: ChildModalProps) => {
  const { registerChildModal, unregisterChildModal, getIsOpen, setIsOpen } =
    useChildModal()

  useEffect(() => {
    registerChildModal(id)

    return () => {
      unregisterChildModal(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <FocusModal
      open={getIsOpen(id)}
      onOpenChange={(open) => setIsOpen(id, open)}
    >
      {children}
    </FocusModal>
  )
}

const Close = FocusModal.Close
const Header = FocusModal.Header
const Body = FocusModal.Body
const Trigger = FocusModal.Trigger
const Footer = FocusModal.Footer
const Title = FocusModal.Title

const Content = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof FocusModal.Content>
>(({ className, ...props }, ref) => {
  return (
    <FocusModal.Content
      ref={ref}
      className={clx("top-6", className)}
      {...props}
    />
  )
})
Content.displayName = "FocusModal.Content"

export const ChildModal = Object.assign(Root, {
  Close,
  Header,
  Body,
  Content,
  Trigger,
  Footer,
  Title,
})
