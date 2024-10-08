export interface UpdateReturnWorkflowInput {
  return_id: string
  location_id?: string | null
  no_notification?: boolean
  metadata?: Record<string, any> | null
}
