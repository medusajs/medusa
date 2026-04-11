import React from "react"
import clsx from "clsx"
import SectionDivider from "../Divider"
import { forwardRef } from "react"
import { WideSection } from "docs-ui"

type SectionContainerProps = {
  children: React.ReactNode
  noTopPadding?: boolean
  noDivider?: boolean
  className?: string
}

const SectionContainer = forwardRef<HTMLDivElement, SectionContainerProps>(
  function SectionContainer(
    { children, noTopPadding = false, noDivider = false, className },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={clsx(
          "relative pb-4 md:pb-7",
          !noTopPadding && "pt-7",
          className
        )}
        data-testid="section-container"
      >
        <WideSection>{children}</WideSection>
        {!noDivider && <SectionDivider />}
      </div>
    )
  }
)

export default SectionContainer
