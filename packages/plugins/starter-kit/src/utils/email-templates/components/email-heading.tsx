import { Heading } from "@react-email/components"
import type { ReactNode } from "react"
import { emailStyles } from "./styles"

export function EmailHeading({ children }: { children: ReactNode }) {
  return <Heading style={emailStyles.heading}>{children}</Heading>
}
