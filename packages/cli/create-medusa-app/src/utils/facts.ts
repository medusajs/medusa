import boxen from "boxen"
import chalk from "chalk"
import { emojify } from "node-emoji"
import { Ora } from "ora"
import ProcessManager from "./process-manager.js"

export type FactBoxOptions = {
  interval: NodeJS.Timeout | null
  spinner: Ora
  processManager: ProcessManager
  message?: string
  title?: string
  verbose?: boolean
}

const facts = [
  "Plugins allow you to integrate third-party services for payment, fulfillment, notifications, and more.",
  "You can specify a product's availability in one or more sales channels.",
  "Payment and shipping options and providers can be configured per region.",
  "Tax-inclusive pricing allows you to set prices for products, shipping options, and more without having to worry about calculating taxes.",
  "Medusa provides multi-currency and region support, with full control over prices for each currency and region.",
  "You can organize customers by customer groups and set special prices for them.",
  "You can specify the inventory of products per location and sales channel.",
  "Publishable-API Keys allow you to send requests to the backend within a scoped resource.",
  "You can create custom endpoints by creating a TypeScript file under the src/api directory.",
  "You can listen to events to perform asynchronous actions using Subscribers.",
  "An entity represents a table in the database. You can create a table by creating a custom entity and migration.",
  "Medusa's store endpoint paths are prefixed by /store. The admin endpoints are prefixed by /admin.",
  "Medusa provides a JavaScript client and a React library that you can use to build a storefront or a custom admin.",
  "Services are classes with methods related to an entity or functionality. You can create a custom service in a TypeScript file under src/services.",
  "Modules allow you to replace an entire functionality with your custom logic.",
  "The event bus module is responsible for triggering events and relaying them to subscribers.",
  "The cache module is responsible for caching data that requires heavy computation.",
]

export const getFact = () => {
  const randIndex = Math.floor(Math.random() * facts.length)

  return facts[randIndex]
}

export const showFact = ({
  spinner,
  title,
  verbose,
}: Pick<FactBoxOptions, "spinner" | "verbose"> & {
  title: string
}) => {
  const fact = getFact()
  if (verbose) {
    spinner.stopAndPersist({
      symbol: chalk.cyan("⠋"),
      text: title,
    })
  } else {
    spinner.text = `${title}\n${boxen(`${fact}`, {
      title: chalk.cyan(`${emojify(":bulb:")} Medusa Tips`),
      titleAlignment: "center",
      textAlignment: "center",
      padding: 1,
      margin: 1,
    })}`
  }
}

export const createFactBox = ({
  spinner,
  title,
  processManager,
  verbose,
}: Pick<FactBoxOptions, "spinner" | "processManager" | "verbose"> & {
  title: string
}): NodeJS.Timeout => {
  showFact({ spinner, title, verbose })
  const interval = setInterval(() => {
    showFact({ spinner, title, verbose })
  }, 10000)

  processManager.addInterval(interval)

  return interval
}

export const resetFactBox = ({
  interval,
  spinner,
  successMessage,
  processManager,
  newTitle,
  verbose,
}: Pick<
  FactBoxOptions,
  "interval" | "spinner" | "processManager" | "verbose"
> & {
  successMessage: string
  newTitle?: string
}): NodeJS.Timeout | null => {
  if (interval) {
    clearInterval(interval)
  }

  spinner.succeed(chalk.green(successMessage)).start()
  let newInterval = null
  if (newTitle) {
    newInterval = createFactBox({
      spinner,
      title: newTitle,
      processManager,
      verbose,
    })
  }

  return newInterval
}

export function displayFactBox({
  interval,
  spinner,
  processManager,
  title = "",
  message = "",
  verbose = false,
}: FactBoxOptions): NodeJS.Timeout | null {
  if (!message) {
    return createFactBox({ spinner, title, processManager, verbose })
  }

  return resetFactBox({
    interval,
    spinner,
    successMessage: message,
    processManager,
    newTitle: title,
    verbose,
  })
}
