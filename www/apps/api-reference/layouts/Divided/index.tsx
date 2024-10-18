import clsx from "clsx"
import { forwardRef } from "react"

export type DividedLayoutProps = {
  mainContent: React.ReactNode
  codeContent: React.ReactNode
  className?: string
  mainContentClassName?: string
  codeContentClassName?: string
  addYSpacing?: boolean
}

const DividedLayout = forwardRef<HTMLDivElement, DividedLayoutProps>(
  function DividedLayout(
    {
      mainContent,
      codeContent,
      className,
      mainContentClassName,
      codeContentClassName,
      addYSpacing = false,
    },
    ref
  ) {
    return (
      <div
        className={clsx(
          "flex w-full flex-col justify-between lg:flex-row lg:gap-4",
          addYSpacing && "my-3",
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
        {codeContent && (
          <div
            className={clsx(
              "w-full flex-shrink-0 flex-grow-0 lg:w-[calc(50%-32px)] lg:basis-[calc(50%-32px)] lg:pr-1.5",
              "mt-2 lg:mt-0",
              codeContentClassName
            )}
          >
            {codeContent}
          </div>
        )}
      </div>
    )
  }
)

export default DividedLayout
