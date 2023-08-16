import React from "react"
import Details from "../../theme/Details"
import clsx from "clsx"

type TroubleshootingSection = {
  title: string
  content: React.ReactNode
}

type TroubleshootingProps = {
  sections: TroubleshootingSection[]
} & React.AllHTMLAttributes<HTMLDivElement>

const Troubleshooting: React.FC<TroubleshootingProps> = ({ sections }) => {
  return (
    <>
      {sections.map(({ title, content }, index) => (
        <Details
          summary={title}
          key={index}
          className={clsx(index !== 0 && "border-t-0")}
        >
          {content}
        </Details>
      ))}
    </>
  )
}

export default Troubleshooting
