type DividedMarkdownSectionProps = {
  children: React.ReactElement[]
}

const DividedMarkdownSection = ({ children }: DividedMarkdownSectionProps) => {
  return <>{children}</>
}

export const DividedMarkdownContent = DividedMarkdownSection
export const DividedMarkdownCode = DividedMarkdownSection
