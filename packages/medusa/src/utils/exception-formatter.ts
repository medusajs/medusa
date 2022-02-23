import { MedusaError } from "medusa-core-utils"

export enum PostgresError {
  DUPLICATE_ERROR = "23505",
  FOREIGN_KEY_ERROR = "23503"
}
export const formatException = (err): Error => {
  switch (err.code) {
    case POSTGRES_DUPLICATE_ERROR:
      return new MedusaError(MedusaError.Types.DUPLICATE_ERROR, err.detail)
    case POSTGRES_FOREIGN_KEY_ERROR:
      return new MedusaError(MedusaError.Types.INVALID_DATA, err.detail)
    default:
      return err
  }
}
