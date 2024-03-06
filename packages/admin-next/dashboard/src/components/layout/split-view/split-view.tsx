import { Button, clx } from "@medusajs/ui"
import { AnimatePresence, motion } from "framer-motion"
import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  createContext,
  useContext,
  useRef,
  useState,
} from "react"
import FocusLock from "react-focus-lock"

import { useMediaQuery } from "../../../hooks/use-media-query"

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

const Root = ({
  open: controlledOpen,
  onOpenChange,
  children,
}: SplitViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledOpen !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }

    if (onOpenChange) {
      onOpenChange(newOpen)
    }
  }

  return (
    <SplitViewContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div
        ref={containerRef}
        className="relative flex size-full overflow-hidden"
      >
        {children}
      </div>
    </SplitViewContext.Provider>
  )
}

const Content = ({ children }: PropsWithChildren) => {
  const { open, onOpenChange } = useSplitViewContext()
  const isLargeScreenSize = useMediaQuery("(min-width: 1024px)")

  const contentWidth = !isLargeScreenSize ? "100%" : open ? "50%" : "100%"

  return (
    <motion.div
      initial={{ width: "100%" }}
      animate={{ width: contentWidth }}
      transition={isLargeScreenSize ? { duration: 0.3 } : undefined}
      className="relative h-full overflow-y-auto"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-ui-bg-base absolute inset-0 z-[1000] h-full cursor-pointer"
            tabIndex={-1}
            onClick={() => onOpenChange(false)}
          />
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  )
}

const MotionFocusLock = motion(FocusLock)

const Drawer = ({ children }: PropsWithChildren) => {
  const { open } = useSplitViewContext()
  const isLargeScreenSize = useMediaQuery("(min-width: 1024px)")

  return (
    <AnimatePresence mode={isLargeScreenSize ? "popLayout" : undefined}>
      {open && (
        <MotionFocusLock
          key="drawer"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className={clx(
            "bg-ui-bg-base absolute right-0 top-0 z-[9999] flex h-full w-4/5 overflow-hidden border-l lg:static lg:z-auto lg:w-1/2"
          )}
        >
          {children}
        </MotionFocusLock>
      )}
    </AnimatePresence>
  )
}

const Close = ({
  variant = "secondary",
  size = "small",
  onClick,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Button>) => {
  const { onOpenChange } = useSplitViewContext()
  const handleClick = onClick ?? (() => onOpenChange(false))

  return (
    <Button size={size} variant={variant} onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

const Open = ({
  variant = "secondary",
  size = "small",
  onClick,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Button>) => {
  const { onOpenChange } = useSplitViewContext()
  const handleClick = onClick ?? (() => onOpenChange(true))

  return (
    <Button
      id="split-view-open"
      size={size}
      variant={variant}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  )
}

/**
 * SplitView is a layout component that allows you to create a split view layout within a FocusModal.
 */
export const SplitView = Object.assign(Root, {
  Content,
  Drawer,
  Close,
  Open,
})
