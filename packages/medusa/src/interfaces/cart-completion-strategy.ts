import { IdempotencyKey } from "../models/idempotency-key"
import { RequestContext } from "../types/request"

export type CartCompletionResponse = {
  response_code: number
  response_body: object
}

export interface ICartCompletionStrategy {
  complete(
    cartId: string,
    idempotencyKey: IdempotencyKey,
    context: RequestContext
  ): Promise<CartCompletionResponse>
}

export function isCartCompletionStrategy(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): object is ICartCompletionStrategy {
  return typeof object.complete === "function"
}
