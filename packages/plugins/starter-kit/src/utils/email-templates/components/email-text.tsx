import { Text } from "@react-email/components"
import type { ReactNode } from "react"
import { emailStyles } from "./styles"

export function EmailText({ children }: { children: ReactNode }) {
  return <Text style={emailStyles.text}>{children}</Text>
}
