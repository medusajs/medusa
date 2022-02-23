import { MedusaError } from "medusa-core-utils"

export enum PostgresError {
  DUPLICATE_ERROR = "23505",
  FOREIGN_KEY_ERROR = "23503",
}
export const formatException = (error): Error => {
  switch (error.code) {
    case PostgresError.DUPLICATE_ERROR:
      // example error.detail: Key (handle)=(test-collection) already exists
      return new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `${error.table.charAt(0).toUpperCase()}${error.table
          .slice(1)
          .replace("_", " ")} with ${error.detail
          .slice(4)
          .replace(/[()=]/g, (s) => (s === "=" ? " " : ""))}`
      )
    case PostgresError.FOREIGN_KEY_ERROR: {
      // example error.detail: Key (customer_id)=(test-customer-27) is not present in table "customer".
      const matches =
        /Key \(([\w-\d]+)\)=\(([\w-\d]+)\) is not present in table "(\w+)"/g.exec(
          error.detail
        )

      if (matches?.length !== 4) {
        return new MedusaError(MedusaError.Types.NOT_FOUND, error.detail)
      }

      return new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `${matches[3]?.charAt(0).toUpperCase()}${matches[3]
          ?.slice(1)
          .replace("_", " ")} with ${matches[1].replace("_", " ")} ${
          matches[2]
        } does not exist.`
      )
    }
    default:
      return error
  }
}
