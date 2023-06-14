import { PropsWithChildren } from "react"
import { AnimatePresence, motion } from "framer-motion"
import * as Portal from "@radix-ui/react-portal"

const MODAL_WIDTH = 560

type SideModalProps = PropsWithChildren<{
  close: () => void
  isVisible: boolean
}>

/**
 * Side modal displayed as right drawer on open.
 */
function SideModal(props: SideModalProps) {
  const { isVisible, children, close } = props
  return (
    <Portal.Root>
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: "easeInOut" }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 99,
                background: "rgba(0,0,0,.3)",
              }}
            ></motion.div>
            <motion.div
              transition={{ ease: "easeInOut" }}
              initial={{ right: -MODAL_WIDTH }}
              style={{
                position: "fixed",
                height: "100%",
                width: MODAL_WIDTH,
                background: "white",
                right: 0,
                top: 0,
                zIndex: 200,
              }}
              className="overflow-hidden rounded border"
              animate={{ right: 0 }}
              exit={{ right: -MODAL_WIDTH }}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal.Root>
  )
}

export default SideModal
