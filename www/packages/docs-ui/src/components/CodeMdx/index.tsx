import React from "react"
import {
  CodeBlock,
  CodeBlockMetaFields,
  CodeBlockProps,
} from "@/components/CodeBlock"
import { InlineCode, InlineCodeProps } from "@/components/InlineCode"
import { MermaidDiagram } from "@/components/MermaidDiagram"
import { Npm2YarnCode } from "../Npm2YarnCode"
import { Npx2YarnCode } from "../Npx2YarnCode"

export type CodeMdxProps = {
  className?: string
  children?: React.ReactNode
  inlineCodeProps?: Partial<InlineCodeProps>
  codeBlockProps?: Partial<CodeBlockProps>
} & CodeBlockMetaFields

// due to how mdx handles code blocks
// it is required that a code block specify a language
// to be considered a block. Otherwise, it will be
// considered as inline code
export const CodeMdx = ({
  className,
  children,
  inlineCodeProps = {},
  codeBlockProps = {},
  ...rest
}: CodeMdxProps) => {
  if (!children) {
    return <></>
  }

  const match = /language-(\w+)/.exec(className || "")

  const codeContent = Array.isArray(children)
    ? (children[0] as string)
    : (children as string)

  if (match) {
    if (rest.npm2yarn) {
      return <Npm2YarnCode npmCode={codeContent} {...rest} />
    } else if (rest.npx2yarn || rest.npx2yarnExec) {
      return (
        <Npx2YarnCode
          npxCode={codeContent}
          {...rest}
          isExecutable={!!rest.npx2yarnExec}
        />
      )
    } else if (match[1] === "mermaid") {
      return <MermaidDiagram diagramContent={codeContent} />
    }
    return (
      <CodeBlock
        source={codeContent}
        lang={match[1]}
        {...codeBlockProps}
        {...rest}
      />
    )
  }

  return <InlineCode {...inlineCodeProps}>{codeContent}</InlineCode>
}
