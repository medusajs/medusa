import { MedusaError } from "./errors"

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

/**
 * Check whether provided string is an email.
 * @param email - string to check
 */
function isEmail(email: string) {
  return email.toLowerCase().match(EMAIL_REGEX)
}

/**
 * Used to validate user email.
 * @param {string} email - email to validate
 * @return {string} the validated email
 */
export function validateEmail(email: string): string {
  const validatedEmail = isEmail(email)

  if (!validatedEmail) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "The email is not valid"
    )
  }

  return email.toLowerCase()
}
