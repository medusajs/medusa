import { FetchError } from "@zjedene-medusa/js-sdk"

export const isFetchError = (error: any): error is FetchError => {
  return error instanceof FetchError
}
