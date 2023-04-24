import { ValidationRule } from "react-hook-form"
import { normalizeAmount } from "./prices"

/**
 * Utility functions for validating form inputs.
 */
const FormValidator = {
  whiteSpaceRule: (name: string) =>
    ({
      value: /^[^\s]+(?:$|.*[^\s]+$)/,
      message: `${name} cannot have leading or trailing spaces, or be an empty string.`,
    } as ValidationRule<RegExp>),
  nonNegativeNumberRule: (name: string) => ({
    value: 0,
    message: `${name} cannot be negative.`,
  }),
  minOneCharRule: (name: string) => ({
    value: 1,
    message: `${name} must be at least 1 character.`,
  }),
  min: (name: string, min: number) => ({
    value: min,
    message: `${name} must be greater than or equal to ${min}.`,
  }),
  max: (name: string, max: number) => ({
    value: max,
    message: `${name} must be less than or equal to ${max}.`,
  }),
  required: (name: string) => ({
    value: true,
    message: `${name} is required.`,
  }),
  minLength: (name: string, min: number) => ({
    value: min,
    message: `${name} must be at least ${min} characters.`,
  }),
  maxInteger: (name: string, currency?: string) => {
    return {
      value: MAX_INTEGER,
      message: `${name} must be less than or equal to ${getNormalizedAmount(
        currency
      )}.`,
    }
  },
  validateMaxInteger: (name: string, amount: number, currency?: string) => {
    return (
      amount <= MAX_INTEGER ||
      `${name} must be less than or equal to ${getNormalizedAmount(currency)}.`
    )
  },
}

/**
 * The maximum integer value that can be stored in the database.
 */
const MAX_INTEGER = 2147483647

/**
 * Gets the normalized amount for the given currency, and if not provided then returns the MAX_INTEGER.
 */
const getNormalizedAmount = (currency?: string) => {
  const amount = currency ? normalizeAmount(currency, MAX_INTEGER) : MAX_INTEGER

  return amount.toLocaleString()
}

export default FormValidator
