import { modules } from "../constants/references.js"

type ReferenceType = "module" | "custom"

export default function getReferenceType(name: string): ReferenceType {
  switch (true) {
    case modules.includes(name):
      return "module"
    default:
      return "custom"
  }
}
