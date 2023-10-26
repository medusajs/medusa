import { PropTable } from "@/components/props-table"
import { PropDataMap } from "@/types/props"

const codeBlockProps: PropDataMap = [
  {
    prop: "snippets",
    type: {
      type: "object",
      name: "CodeSnippet[]",
      shape:
        "{\n  label: string\n  language: string\n  code: string\n  hideLineNumbers?: boolean\n}[]",
    },
  },
]

const Props = () => {
  return <PropTable props={codeBlockProps} />
}

export default Props
