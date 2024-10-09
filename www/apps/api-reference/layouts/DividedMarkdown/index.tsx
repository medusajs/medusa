import React from "react"
import DividedLayout, { DividedLayoutProps } from "../Divided"

type DividedMarkdownLayoutProps = {
  children: React.ReactNode
} & Omit<DividedLayoutProps, "mainContent" | "codeContent">

const DividedMarkdownLayout = ({
  children,
  ...props
}: DividedMarkdownLayoutProps) => {
  const childArr = React.isValidElement(children)
    ? [children]
    : Array.isArray(children)
    ? children
    : []

  if (!childArr.length) {
    return <></>
  }

  const contentElm = childArr[0]
  const codeElm = childArr.length > 1 ? childArr[1] : <></>

  return (
    <DividedLayout mainContent={contentElm} codeContent={codeElm} {...props} />
  )
}

export default DividedMarkdownLayout
