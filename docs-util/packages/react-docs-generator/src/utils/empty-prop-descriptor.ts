import { PropDescriptor } from "react-docgen/dist/Documentation.js"

export default function emptyPropDescriptor(propDescriptor: PropDescriptor) {
  const objKeys = Object.keys(propDescriptor)
  objKeys.forEach((key) => {
    delete propDescriptor[key as keyof PropDescriptor]
  })
}
