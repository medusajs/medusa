import clsx from "clsx"

type DividedLayoutProps = {
  mainContent: React.ReactNode
  codeContent: React.ReactNode
  className?: string
}

const DividedLayout = ({
  mainContent,
  codeContent,
  className,
}: DividedLayoutProps) => {
  return (
    <div className={clsx("flex w-full justify-between gap-1", className)}>
      <div className="w-api-ref-content">{mainContent}</div>
      <div className="w-api-ref-code z-10 px-1">{codeContent}</div>
    </div>
  )
}

export default DividedLayout
