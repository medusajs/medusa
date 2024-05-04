import { PropDescriptor } from "react-docgen/dist/Documentation.js"

export default function isEmptyPropDescriptor(propDescriptor: PropDescriptor) {
  const objKeys = Object.keys(propDescriptor)
  return (
    objKeys.length === 0 ||
    objKeys.every((objKey) => {
      const value = propDescriptor[objKey as keyof PropDescriptor]
      switch (typeof value) {
        case "string":
          return value.length === 0
        case "object":
          return Object.keys(value).length === 0
        default:
          return false
      }
    })
  )
}
