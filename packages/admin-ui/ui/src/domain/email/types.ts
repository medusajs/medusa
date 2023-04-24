export enum MailTemplateId {
  VENDOR_CONTACT = "mail.vendor.contact",
  CUSTOMER_FORGOT_PASSWORD = "mail.customer.forgot_password",
  CUSTOMER_ORDER_SUMMARY = "mail.customer.order_summary",
  VENDOR_ORDER_SUMMARY = "mail.vendor.order_summary",
  CUSTOMER_ORDER_ITEMS_SHIPPED = "mail.customer.order_items_shipped",
  USER_INVITE = "mail.user.invite",
  USER_FORGOT_PASSWORD = "mail.user.forgot_password",
}

export interface MailTemplate {
  id: string
  title: string
  subject: string
  previewData: Record<string, any>
}

export interface MailMessage {
  subject: string
  html?: string
  text?: string
}
