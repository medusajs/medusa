import allReferences from "../constants/references.js"

export default function getReferences(names: string[]): string[] {
  return names.includes("all") ? allReferences : names
}
