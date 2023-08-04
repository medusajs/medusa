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
        "flex w-full flex-col justify-between lg:flex-row lg:gap-4",
        className
      )}
    >
      <div
        className={clsx(
          "w-full flex-shrink-0 flex-grow-0 basis-full lg:w-[calc(50%-32px)] lg:basis-[calc(50%-32px)] lg:pl-4",
          mainContentClassName
        )}
      >
        {mainContent}
      </div>
      <div
        className={clsx(
          "w-full flex-shrink-0 flex-grow-0 basis-full pr-1.5 lg:w-[calc(50%-32px)] lg:basis-[calc(50%-32px)]",
          codeContentClassName
        )}
      >
        {codeContent}
      </div>
    </div>
  )
}

export default DividedLayout
