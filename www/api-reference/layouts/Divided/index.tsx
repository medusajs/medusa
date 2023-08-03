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
      <div className={clsx("w-full lg:w-1/2 lg:pl-4", mainContentClassName)}>
        {mainContent}
      </div>
      <div
        className={clsx("z-10 w-full pr-1.5 lg:w-1/2", codeContentClassName)}
      >
        {codeContent}
      </div>
    </div>
  )
}

export default DividedLayout
