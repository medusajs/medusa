import {
  ForeignKeyConstraintViolationException,
  InvalidFieldNameException,
  NotFoundError,
  NotNullConstraintViolationException,
  UniqueConstraintViolationException,
} from "@mikro-orm/core"
import { MedusaError, upperCaseFirst } from "../../common"

export const dbErrorMapper = (err: Error) => {
  if (err instanceof NotFoundError) {
    console.log(err)
    throw new MedusaError(MedusaError.Types.NOT_FOUND, err.message)
  }

  if (err instanceof UniqueConstraintViolationException) {
    const info = getConstraintInfo(err)
    if (!info) {
      throw err
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${upperCaseFirst(info.table)} with ${info.keys
        .map((key, i) => `${key}: ${info.values[i]}`)
        .join(", ")} already exists.`
    )
  }

  if (err instanceof NotNullConstraintViolationException) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot set field '${(err as any).column}' of ${upperCaseFirst(
        (err as any).table
      )} to null`
    )
  }

  if (err instanceof InvalidFieldNameException) {
    const userFriendlyMessage = err.message.match(/(column.*)/)?.[0]
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      userFriendlyMessage ?? err.message
    )
  }

  if (err instanceof ForeignKeyConstraintViolationException) {
    const info = getConstraintInfo(err)
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `You tried to set relationship ${info?.keys.map(
        (key, i) => `${key}: ${info.values[i]}`
      )}, but such entity does not exist`
    )
  }

  throw err
}

const getConstraintInfo = (err: any) => {
  const detail = err.detail as string
  if (!detail) {
    return null
  }

  const [keys, values] = detail.match(/\([^\(.]*\)/g) || []

  if (!keys || !values) {
    return null
  }

  return {
    table: err.table.split("_").join(" "),
    keys: keys
      .substring(1, keys.length - 1)
      .split(",")
      .map((k) => k.trim()),
    values: values
      .substring(1, values.length - 1)
      .split(",")
      .map((v) => v.trim()),
  }
}
