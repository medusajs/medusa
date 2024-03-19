import React from "react"
import clsx from "clsx"
import { Details, MarkdownContent } from "@/components"

type TroubleshootingSection = {
  title: string
  content: React.ReactNode
}

type DetailsListProps = {
  sections: TroubleshootingSection[]
} & React.AllHTMLAttributes<HTMLDivElement>

export const DetailsList = ({ sections }: DetailsListProps) => {
  return (
    <>
      {sections.map(({ title, content }, index) => (
        <Details
          summaryContent={title}
          key={index}
          className={clsx(index !== 0 && "border-t-0")}
        >
          {React.isValidElement(content) && content}
          {!React.isValidElement(content) && typeof content === "string" && (
            <MarkdownContent>{content}</MarkdownContent>
          )}
        </Details>
      ))}
    </>
  )
}
