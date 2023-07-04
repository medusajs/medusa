import React from "react"

type PageDescriptionProps = {
  title?: string
  subtitle?: string
}

const PageDescription: React.FC<PageDescriptionProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-xlarge">
      <h1 className="inter-2xlarge-semibold mb-xsmall">{title}</h1>
      <h2 className="inter-base-regular text-grey-50">{subtitle}</h2>
    </div>
  )
}

export default PageDescription
