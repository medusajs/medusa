import {
  EmailButton,
  EmailHeading,
  EmailLayout,
  EmailMutedText,
  EmailText,
  EmailUrlFallback,
} from "./components"

export type InviteUserEmailProps = {
  inviteUrl: string
  email: string
  storeName: string
}

export function InviteUserEmail({
  inviteUrl,
  email,
  storeName,
}: InviteUserEmailProps) {
  return (
    <EmailLayout
      preview={`You've been invited to join ${storeName}'s admin dashboard`}
    >
      <EmailHeading>You're Invited!</EmailHeading>
      <EmailText>Hello {email},</EmailText>
      <EmailText>
        You've been invited to join {storeName}. Click the button below to
        accept your invitation and set up your account.
      </EmailText>
      <EmailButton href={inviteUrl}>Accept Invitation</EmailButton>
      <EmailUrlFallback href={inviteUrl} />
      <EmailMutedText>
        If you weren't expecting this invitation, you can ignore this email.
      </EmailMutedText>
    </EmailLayout>
  )
}

// For previews
export default function getInviteUserEmail(props?: InviteUserEmailProps) {
  return (
    <InviteUserEmail
      inviteUrl={props?.inviteUrl ?? "#"}
      email={props?.email ?? "user@example.com"}
      storeName={props?.storeName ?? "Acme"}
    />
  )
}
