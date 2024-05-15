import { ChalkInstance } from "chalk"

type Options = {
  chalkInstance: ChalkInstance
  title: string
  message: string
}

export default function formatColoredLog({
  chalkInstance,
  title,
  message,
}: Options) {
  console.log(`${chalkInstance(title)} -> ${message}`)
}
