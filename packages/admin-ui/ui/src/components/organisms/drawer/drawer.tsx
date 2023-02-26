import { AnimatePresence, motion } from "framer-motion"
import { PropsWithChildren } from "react"

const MODAL_WIDTH = 560

type Props = PropsWithChildren<{
  close: () => void
  isVisible: boolean
}>

/**
 * Component that renders a drawer on the right side of the screen.
 */
export const Drawer = ({ close, isVisible, children }: Props) => {
  return (
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
              position: "absolute",
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
              zIndex: 9999,
            }}
            className="rounded-base overflow-hidden border"
            animate={{ right: 0 }}
            exit={{ right: -MODAL_WIDTH }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
