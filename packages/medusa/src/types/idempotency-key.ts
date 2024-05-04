export type CreateIdempotencyKeyInput = {
  request_method?: string
  request_params?: Record<string, unknown>
  request_path?: string
  idempotency_key?: string
}

export type IdempotencyCallbackResult = {
  recovery_point?: string
  response_code?: number
  response_body?: Record<string, unknown>
}
