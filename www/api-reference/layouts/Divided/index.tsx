type DividedLayoutProps = {
  mainContent: React.ReactNode
  codeContent: React.ReactNode
}

const DividedLayout = ({ mainContent, codeContent }: DividedLayoutProps) => {
  return (
    <div className="flex w-full justify-between gap-1">
      <div className="w-api-ref-content">{mainContent}</div>
      <div className="w-api-ref-code z-10 px-1">{codeContent}</div>
    </div>
  )
}

export default DividedLayout
