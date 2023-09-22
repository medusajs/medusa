import { CodeBlock } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa React",
    language: "tsx",
    code: `import { useProduct } from "medusa-react"\n\nconst { product } = useProduct("PRODUCT_ID")\nconsole.log(product.id)`,
  },
]

export default function CodeBlockNoHeader() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}
