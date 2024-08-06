import { SignatureReflection } from "typedoc"

export function isWorkflow(reflection: SignatureReflection): boolean {
  return (
    reflection.parent.children?.some((child) => child.name === "runAsStep") ||
    false
  )
}
