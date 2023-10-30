import { CodeBlock, Label } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa React",
    language: "tsx",
    code: `import { useProduct } from "medusa-react"\n\nconst { product } = useProduct("PRODUCT_ID")\nconsole.log(product.id)`,
  },
]

export default function CodeBlockSingle() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Header hideLabels={true}>
          <CodeBlock.Header.Meta>
            <Label weight={"plus"}>/product-detail.js</Label>
          </CodeBlock.Header.Meta>
        </CodeBlock.Header>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}
