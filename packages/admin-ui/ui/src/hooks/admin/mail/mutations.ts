import { useMutation } from "react-query"
import { MailMessage } from "../../../domain/email/types"
import medusaRequest from "../../../services/request"

export interface AdminPostGetMailPreviewReq {
  template_id: string
  data?: Record<string, unknown>
}

export interface AdminPostGetMailPreviewRes {
  preview: MailMessage
}

export interface AdminPostSendMailPreviewReq {
  template_id: string
  to: string
  cc?: string
  bcc?: string
  reply_to?: string
  subject?: string
  data?: Record<string, unknown>
}

export interface AdminPostSendMailPreviewRes {
  success: boolean
  message: string
}

export const useAdminGetMailPreview = () => {
  const path = `/admin/mail/preview`

  return useMutation((payload: AdminPostGetMailPreviewReq) =>
    medusaRequest<AdminPostGetMailPreviewRes>("POST", path, payload)
  )
}

export const useAdminSendMailPreview = () => {
  const path = `/admin/mail/send-preview`

  return useMutation((payload: AdminPostSendMailPreviewReq) =>
    medusaRequest<AdminPostSendMailPreviewRes>("POST", path, payload)
  )
}
