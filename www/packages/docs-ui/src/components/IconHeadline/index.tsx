import React from "react"

type IconHeadlineProps = {
  title: string
  icon: React.ReactNode
}

export const IconHeadline = ({ title, icon }: IconHeadlineProps) => {
  return (
    <div className="flex gap-docs_0.5 text-medusa-fg-base">
      {icon}
      <span className="text-small-plus">{title}</span>
    </div>
  )
}
