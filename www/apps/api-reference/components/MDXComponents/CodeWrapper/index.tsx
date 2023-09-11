import CodeBlock from "@/components/CodeBlock"
import InlineCode from "../../InlineCode"

type CodeWrapperProps = {
  className?: string
  children?: React.ReactNode
}

// due to how mdx handles code blocks
// it is required that a code block specify a language
// to be considered a block. Otherwise, it will be
// considered as inline code
const CodeWrapper = ({ className, children }: CodeWrapperProps) => {
  if (!children) {
    return <></>
  }

  const match = /language-(\w+)/.exec(className || "")

  if (match) {
    return <CodeBlock source={children as string} lang={match[1]} />
  }

  return <InlineCode>{children}</InlineCode>
}

export default CodeWrapper
