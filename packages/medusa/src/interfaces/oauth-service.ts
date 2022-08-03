import { TransactionBaseService } from "./transaction-base-service"

export interface IOauthService<T extends TransactionBaseService<never>>
  extends TransactionBaseService<T> {
  generateToken(code: string): Promise<Record<string, unknown>>
  refreshToken(token: unknown): Promise<Record<string, unknown>>
  destroyToken(token: unknown): Promise<void>
}

export abstract class AbstractOauthService<
    T extends TransactionBaseService<never>
  >
  extends TransactionBaseService<T>
  implements IOauthService<T>
{
  abstract generateToken(code: string): Promise<Record<string, unknown>>
  abstract refreshToken(token: unknown): Promise<Record<string, unknown>>
  abstract destroyToken(token: unknown): Promise<void>
}

export function isOAuthService(obj: unknown): boolean {
  return obj instanceof AbstractOauthService
}
