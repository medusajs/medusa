import type { Meta, StoryObj } from "@storybook/react"
import React from "react"

import { Label } from "../label"
import { CodeBlock } from "./code-block"

const meta: Meta<typeof CodeBlock> = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof CodeBlock>

const snippets = [
  {
    label: "cURL",
    language: "markdown",
    code: `curl -H 'x-publishable-key: YOUR_API_KEY' 'http://localhost:9000/store/products/PRODUCT_ID'`,
  },
  {
    label: "Medusa JS Client",
    language: "jsx",
    code: `// Install the JS Client in your storefront project: @medusajs/medusa-js\n\nimport Medusa from "@medusajs/medusa-js"\n\nconst medusa = new Medusa({ publishableApiKey: "YOUR_API_KEY"})\nconst product = await medusa.products.retrieve("PRODUCT_ID")\nconsole.log(product.id)`,
  },
  {
    label: "Medusa React",
    language: "tsx",
    code: `// Install the React SDK and required dependencies in your storefront project:\n// medusa-react @tanstack/react-query @medusajs/medusa\n\nimport { useProduct } from "medusa-react"\n\nconst { product } = useProduct("PRODUCT_ID")\nconsole.log(product.id)`,
  },
]

export const Default: Story = {
  render: () => {
    return (
      <div className="h-[300px] w-[700px]">
        <CodeBlock snippets={snippets}>
          <CodeBlock.Header>
            <CodeBlock.Header.Meta>
              <Label size="small" weight={"plus"}>
                /product-detail.js
              </Label>
            </CodeBlock.Header.Meta>
          </CodeBlock.Header>
          <CodeBlock.Body />
        </CodeBlock>
      </div>
    )
  },
}

const code = `medusa develop
✔ Models initialized – 14ms
✔ Repositories initialized – 35ms
✔ Strategies initialized – 24ms
✔ Modules initialized – 1ms
✔ Database initialized – 654ms
✔ Services initialized – 7ms
✔ Express intialized – 5ms
✔ Plugins intialized – 7ms
✔ Subscribers initialized – 6ms
✔ API initialized – 28ms
✔ Server is ready on port: 9000`

export const ManyLines: Story = {
  render: () => {
    return (
      <CodeBlock
        snippets={[
          {
            code: code,
            label: "Test",
            language: "bash",
            hideCopy: true,
          },
        ]}
        className="w-[700px]"
      >
        <CodeBlock.Body />
      </CodeBlock>
    )
  },
}
