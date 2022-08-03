export type CreateOauth = {
  display_name: string
  application_name: string
  install_url?: string
  uninstall_url?: string
}

export type UpdateOauth = {
  data: Record<string, unknown>
}
