import { Button, clx } from "@medusajs/ui"
import * as Dialog from "@radix-ui/react-dialog"
import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
} from "react"

type SplitViewContextValue = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SplitViewContext = createContext<SplitViewContextValue | null>(null)

const useSplitViewContext = () => {
  const context = useContext(SplitViewContext)

  if (!context) {
    throw new Error("useSplitViewContext must be used within a SplitView")
  }

  return context
}

type SplitViewProps = PropsWithChildren<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>

const Root = ({ open, onOpenChange, children }: SplitViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <div ref={containerRef} className="relative size-full overflow-hidden">
        {children}
      </div>
    </Dialog.Root>
  )
}

const Content = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={clx("relative h-full overflow-y-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
}

const Drawer = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <Dialog.Overlay
        className={clx(
          "bg-ui-bg-base absolute inset-0 opacity-40",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        )}
      />
      <Dialog.Content
        className={clx(
          "bg-ui-bg-base border-ui-border-base absolute inset-y-0 right-0 flex w-full max-w-[calc(100%-128px)] flex-1 flex-col border-l focus:outline-none md:max-w-[80%] lg:max-w-[50%]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-1/2 data-[state=open]:slide-in-from-right-1/2 duration-200"
        )}
      >
        {children}
      </Dialog.Content>
    </div>
  )
}

const Close = ({
  variant = "secondary",
  size = "small",
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Button>) => {
  return (
    <Dialog.Close asChild>
      <Button size={size} variant={variant} {...props}>
        {children}
      </Button>
    </Dialog.Close>
  )
}

/**
 * SplitView is a layout component that allows you to create a split view layout within a FocusModal.
 */
export const SplitView = Object.assign(Root, {
  Content,
  Drawer,
  Close,
})
