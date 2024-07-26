export interface UpdateReturnWorkflowInput {
  return_id: string
  location_id?: string
  no_notification?: boolean
  metadata?: Record<string, any> | null
}
