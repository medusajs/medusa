import clsx from "clsx"
import SectionDivider from "../Divider"

type SectionContainerProps = {
  children: React.ReactNode
  noTopPadding?: boolean
}

const SectionContainer = ({
  children,
  noTopPadding = false,
}: SectionContainerProps) => {
  return (
    <div className={clsx("relative pb-7", !noTopPadding && "pt-7")}>
      {children}
      <SectionDivider />
    </div>
  )
}

export default SectionContainer
