import clsx from "clsx"

type SectionDividerProps = {
  className?: string
}

const SectionDivider = ({ className }: SectionDividerProps) => {
  return (
    <hr
      className={clsx(
        "absolute bottom-0 -left-1.5 z-0 m-0 w-screen lg:left-0",
        className
      )}
    />
  )
}

export default SectionDivider
