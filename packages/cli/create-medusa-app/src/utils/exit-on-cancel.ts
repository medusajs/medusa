import { cancel, isCancel } from "@clack/prompts"

export default function exitOnCancel<T>(value: T): Exclude<T, symbol> {
  if (isCancel(value)) {
    cancel("Operation cancelled.")
    process.exit(0)
  }

  return value as Exclude<T, symbol>
}
