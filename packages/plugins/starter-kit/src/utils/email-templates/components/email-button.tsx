import { Button, Section } from "@react-email/components"
import type { ReactNode } from "react"
import { emailStyles } from "./styles"

export function EmailButton({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Section style={emailStyles.buttonSection}>
      <Button href={href} style={emailStyles.button}>
        {children}
      </Button>
    </Section>
  )
}
