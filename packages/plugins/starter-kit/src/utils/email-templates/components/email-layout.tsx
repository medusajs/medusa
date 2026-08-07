import { Body, Container, Head, Html, Preview } from "@react-email/components"
import type { PropsWithChildren } from "react"
import { emailStyles } from "./styles"

export function EmailLayout({
  preview,
  children,
}: PropsWithChildren<{ preview: string }>) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={emailStyles.body}>
        <Container style={emailStyles.container}>{children}</Container>
      </Body>
    </Html>
  )
}
