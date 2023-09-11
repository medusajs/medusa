"use client"

import { CodeBlock } from "@/components/code-block"
import { ReactElement } from "react"

/*
  Helper function from:
  https://impedans.me/web/searching-the-inner-text-content-of-nested-react-nodes/
  
  then hackily Typed
*/
export const getRecursiveChildText = (
  reactNode: ReactElement
): string | undefined => {
  const children = reactNode.props.children || undefined
  if (Array.isArray(reactNode)) {
    // Multiple children
    const joinedNodes: (string | undefined | ReactElement)[] = []
    reactNode.forEach((node) => {
      if (typeof node === "object") {
        joinedNodes.push(getRecursiveChildText(node))
      } else if (typeof node === "string") {
        joinedNodes.push(node)
      }
    })
    return joinedNodes.join(" ")
  }
  if (children === undefined) {
    if (typeof reactNode === "string") {
      return reactNode
    } else {
      return " "
    }
  }
  if (typeof children === "object") {
    // Found direct child
    return getRecursiveChildText(reactNode.props.children)
  }
  if (typeof children === "string") {
    // Found searchable string
    return reactNode.props.children
  }
  return undefined
}

const Snippet = ({ children }: { children: ReactElement }) => {
  let code = getRecursiveChildText(children)
  if (!code) {
    return null
  }

  // With the way backticked code is rendered by MDX, we end up with an unnecessary
  // newline at the end of multiline blocks. Snip it if it's there, else display is ugly.
  if (code.endsWith("\n")) {
    code = code.substring(0, code.length - 1)
  }

  // Linting sometimes strips spaces around curly-brackets in import statements,
  // in single-line blocks. Let's put them back.
  code = code.replaceAll(
    /(import \{)(.*)(\})/gi,
    (_, g1, g2, g3) => `${g1} ${g2} ${g3}`
  )

  return <CodeBlock className="my-4 w-full overflow-auto" code={code} />
}

export { Snippet }
