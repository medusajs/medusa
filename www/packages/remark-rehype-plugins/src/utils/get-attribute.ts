import { UnistNodeWithData } from "../types/index.js"

export default function getAttribute(
  node: UnistNodeWithData,
  attrName: string
) {
  const attributeIndex = node.attributes?.findIndex(
    (attribute) => attribute.name === attrName
  )
  if (attributeIndex === undefined || attributeIndex === -1) {
    return
  }
  const attribute = node.attributes![attributeIndex]

  if (!attribute) {
    return
  }

  return attribute
}
