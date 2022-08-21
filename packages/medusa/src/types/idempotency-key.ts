export type CreateIdempotencyKeyInput = {
  request_method: string
  request_params: Record<string, unknown>
  request_path: string
  idempotency_key?: string
}
