import { Text } from "@react-email/components"
import type { ReactNode } from "react"
import { emailStyles } from "./styles"

export function EmailMutedText({ children }: { children: ReactNode }) {
  return <Text style={emailStyles.mutedText}>{children}</Text>
}
