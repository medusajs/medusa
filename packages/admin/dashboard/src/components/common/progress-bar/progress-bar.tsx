import { motion } from "motion/react"

interface ProgressBarProps {
  /**
   * The duration of the animation in seconds.
   *
   * @default 2
   */
  duration?: number
}

export const ProgressBar = ({ duration = 2 }: ProgressBarProps) => {
  return (
    <motion.div
      className="size-full bg-ui-fg-subtle"
      initial={{
        width: "0%",
      }}
      transition={{
        delay: 0.2,
        duration,
        ease: "linear",
      }}
      animate={{
        width: "90%",
      }}
      exit={{
        width: "100%",
        transition: { duration: 0.2, ease: "linear" },
      }}
    />
  )
}
