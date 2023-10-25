import { Node, NodeType } from "./types"

/**
 * Checks if a node is of a certain type.
 */
export function isNodeType<NType extends NodeType, R = Node<NType>>(
  node: Node<any>,
  type: NType
): node is R {
  return node.type === type
}

/**
 * Encodes an object into a query string.
 */
export function encodeQuery(obj: any): string {
  if (!obj) {
    return ""
  }

  return Object.entries(obj)
    .map(([k, v]) => k && v && `${k}=${encodeURIComponent(v as any)}`)
    .filter(Boolean)
    .join("&")
}
