import React from "react"
import { Diagram2CodeSpec } from "@medusajs/docs"
import MDXContent from "@theme/MDXContent"
import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"
import { specs } from "../../utils/specs"
import CodeBlock from "../../theme/CodeBlock"
import Mermaid from "@docusaurus/theme-mermaid/lib/theme/Mermaid/index.js"

type WorkflowReferenceProps = {
  specName: string
}

const Diagram2CodeSpecs = ({ specName }: WorkflowReferenceProps) => {
  if (!Object.hasOwn(specs, specName)) {
    return <></>
  }
  const specsData: Diagram2CodeSpec = specs[specName]
  return (
    <>
      {!Object.keys(specsData).length && <span>No workflows found</span>}
      {Object.entries(specsData).map(([name, diagram2code]) => {
        const diagram = "```mermaid\n" + diagram2code.diagram + "\n```"
        const code = "```ts\n" + diagram2code.code + "\n```"
        return (
          <Tabs groupId="workflows" key={name}>
            <TabItem value="diagram" label="Diagram" default>
              <Mermaid value={diagram2code.diagram} />
            </TabItem>
            <TabItem value="code" label="Code">
              <CodeBlock language="ts">{diagram2code.code}</CodeBlock>
            </TabItem>
          </Tabs>
        )
      })}
    </>
  )
}

export default Diagram2CodeSpecs
