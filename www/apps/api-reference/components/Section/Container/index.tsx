import clsx from "clsx"
import SectionDivider from "../Divider"
import { forwardRef } from "react"

type SectionContainerProps = {
  children: React.ReactNode
  noTopPadding?: boolean
}

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  function SectionContainer({ children, noTopPadding = false }, ref) {
    return (
      <div className={clsx("relative pb-7", !noTopPadding && "pt-7")} ref={ref}>
        {children}
        <SectionDivider className="-left-1.5 lg:!-left-4" />
      </div>
    )
  }
)

export default SectionContainer
