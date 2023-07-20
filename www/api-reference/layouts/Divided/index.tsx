import clsx from "clsx"

type DividedLayoutProps = {
  mainContent: React.ReactNode
  codeContent: React.ReactNode
  className?: string
  mainContentClassName?: string
  codeContentClassName?: string
}

const DividedLayout = ({
  mainContent,
  codeContent,
  className,
  mainContentClassName,
  codeContentClassName,
}: DividedLayoutProps) => {
  return (
    <div
      className={clsx(
        "flex w-full flex-col justify-between gap-1 lg:flex-row",
        className
      )}
    >
      <div
        className={clsx(
          "lg:w-api-ref-content w-full px-1 lg:pl-2",
          mainContentClassName
        )}
      >
        {mainContent}
      </div>
      <div
        className={clsx(
          "lg:w-api-ref-code z-10 w-full px-1",
          codeContentClassName
        )}
      >
        {codeContent}
      </div>
    </div>
  )
}

export default DividedLayout
