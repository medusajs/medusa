import { MedusaError } from "medusa-core-utils"

export enum PostgresError {
  DUPLICATE_ERROR = "23505",
  FOREIGN_KEY_ERROR = "23503",
}
export const formatException = (err): Error => {
  switch (err.code) {
    case PostgresError.DUPLICATE_ERROR:
      return new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `${err.table.charAt(0).toUpperCase()}${err.table.slice(
          1
        )} with ${err.detail
          .slice(4)
          .replace(/[()=]/g, (s) => (s === "=" ? " " : ""))}`
      )
    case PostgresError.FOREIGN_KEY_ERROR:
      return new MedusaError(MedusaError.Types.INVALID_DATA, err.detail)
    default:
      return err
  }
}
