export type CreateOauthInput = {
  display_name: string
  application_name: string
  install_url?: string
  uninstall_url?: string
}

export type UpdateOauthInput = {
  data: Record<string, unknown>
}
