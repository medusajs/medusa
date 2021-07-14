import React from "react"
import { Flex } from "rebass"

import DocsItem from "./docs-item"

const DocsReader = ({ tags, spec }) => {
  const data = Object.entries(tags)
  return (
    <Flex flexDirection="column" width="100%">
      {data.map(([tagName, endpoints]) => (
        <DocsItem tagName={tagName} endpoints={endpoints} spec={spec} />
      ))}
    </Flex>
  )
}

export default DocsReader
