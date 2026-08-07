import { Link } from "@react-email/components"
import { EmailText } from "./email-text"
import { emailStyles } from "./styles"

export function EmailUrlFallback({ href }: { href: string }) {
  return (
    <>
      <EmailText>Or copy and paste this URL into your browser:</EmailText>
      <Link href={href} style={emailStyles.link}>
        {href}
      </Link>
    </>
  )
}
