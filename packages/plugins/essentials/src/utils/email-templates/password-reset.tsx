import {
  EmailButton,
  EmailHeading,
  EmailLayout,
  EmailMutedText,
  EmailText,
  EmailUrlFallback,
} from "./components"

export type PasswordResetEmailProps = {
  resetUrl: string
  email: string
  storeName: string
}

export function PasswordResetEmail({
  resetUrl,
  email,
  storeName,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview={`Reset your password for ${storeName}`}>
      <EmailHeading>Reset Your Password</EmailHeading>
      <EmailText>Hello {email},</EmailText>
      <EmailText>
        We received a request to reset your password for {storeName}. Click the
        button below to create a new password for your account.
      </EmailText>
      <EmailButton href={resetUrl}>Reset Password</EmailButton>
      <EmailUrlFallback href={resetUrl} />
      <EmailMutedText>
        This password reset link will expire soon for security reasons. If you
        didn't request a password reset, you can safely ignore this email.
      </EmailMutedText>
    </EmailLayout>
  )
}

// For previews
export default function getPasswordResetEmail(props?: PasswordResetEmailProps) {
  return (
    <PasswordResetEmail
      resetUrl={props?.resetUrl ?? "#"}
      email={props?.email ?? "user@example.com"}
      storeName={props?.storeName ?? "Acme"}
    />
  )
}
