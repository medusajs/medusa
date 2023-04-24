import React, { PropsWithChildren } from "react"
import { AnimatePresence, motion } from "framer-motion"

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
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
            className="rounded border"
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

export default SideModal
