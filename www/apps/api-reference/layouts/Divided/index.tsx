import clsx from "clsx"
import { forwardRef } from "react"

type DividedLayoutProps = {
  mainContent: React.ReactNode
  codeContent: React.ReactNode
  className?: string
  mainContentClassName?: string
  codeContentClassName?: string
}

const DividedLayout = forwardRef<HTMLDivElement, DividedLayoutProps>(
  function DividedLayout(
    {
      mainContent,
      codeContent,
      className,
      mainContentClassName,
      codeContentClassName,
    },
    ref
  ) {
    return (
      <div
        className={clsx(
          "flex w-full flex-col justify-between lg:flex-row lg:gap-4",
          className
        )}
        ref={ref}
      >
        <div
          className={clsx(
            "w-full flex-shrink-0 flex-grow-0 lg:w-[calc(50%-32px)] lg:basis-[calc(50%-32px)] lg:pl-4",
            mainContentClassName
          )}
        >
          {mainContent}
        </div>
        <div
          className={clsx(
            "w-full flex-shrink-0 flex-grow-0 lg:w-[calc(50%-32px)] lg:basis-[calc(50%-32px)] lg:pr-1.5",
            codeContentClassName
          )}
        >
          {codeContent}
        </div>
      </div>
    )
  }
)

export default DividedLayout
