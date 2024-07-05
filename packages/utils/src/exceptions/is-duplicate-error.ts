import { PostgresError } from "./postgres-error"
export const isDuplicateError = (err: Error & { code?: string }) => {
  return err.code === PostgresError.DUPLICATE_ERROR
}
