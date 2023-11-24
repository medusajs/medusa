import React from "react"
import { Diagram2CodeSpec } from "@medusajs/docs"
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
      {!Object.keys(specsData).length && <span>No diagrams found</span>}
      {Object.entries(specsData).map(([name, diagram2code]) => (
          <React.Fragment key={name}>
            <h2>{name}</h2>
          <Tabs groupId="workflows">
            <TabItem value="diagram" label="Diagram" default>
              <Mermaid value={diagram2code.diagram} />
            </TabItem>
            <TabItem value="code" label="Code">
              <CodeBlock language="ts">{diagram2code.code}</CodeBlock>
            </TabItem>
          </Tabs>
          </React.Fragment>
        ))}
    </>
  )
}

export default Diagram2CodeSpecs
