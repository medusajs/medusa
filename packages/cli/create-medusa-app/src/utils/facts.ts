import boxen from "boxen"
import chalk from "chalk"
import { emojify } from "node-emoji"
import { Ora } from "ora"
import ProcessManager from "./process-manager.js"
import terminalLink from "terminal-link"

export type FactBoxOptions = {
  interval: NodeJS.Timeout | null
  spinner: Ora
  processManager: ProcessManager
  message?: string
  title?: string
  verbose?: boolean
}

const facts = [
  "Specify a product's availability in one or more sales channels.",
  "Payment providers can be configured per region.",
  "Tax-inclusive pricing allows you to set prices for products and shipping options while delegating tax calculations to Medusa.",
  "Medusa provides multi-currency and region support, with full control over prices for each currency and region.",
  "Organize customers by customer groups and set special prices for them.",
  "Specify the inventory of products per location and sales channel.",
  "Publishable-API Keys allow you to send scoped requests to the server's store API routes.",
  "API Routes expose business logic to clients, such as storefronts and admin customizations.",
  "Subscribers are asynchronous functions that are executed when an event is emitted.",
  "Data models represent tables in the database. They are created using Medusa's Data Modeling Language (DML).",
  "Medusa's store API routes are prefixed by /store. The admin API routes are prefixed by /admin.",
  "The JS SDK allows you to send requests to the Medusa server from your storefront or admin customizations.",
  "Modules are reusable packages of functionalities related to a single commerce domain or integration.",
  "Modules have a main service that provides data-management and integration functionalities.",
  "Modules allow you to replace an entire functionality with your custom logic.",
  "Infrastructure Modules are interchangeable modules that implement features and integrations related to the Medusa server's infrastructure.",
  "Commerce Modules are built-in modules that provide core commerce logic specific to domains like Product, Cart and Order.",
  "Workflows are a series of queries and actions, called steps, that complete a task.",
  "A workflow's steps can be retried or rolled back in case of an error.",
  `Medusa provides ${terminalLink(
    "Claude Code plugins",
    "https://github.com/medusajs/medusa-claude-plugins"
  )} to facilitate your development.`,
  "Medusa provides an MCP server at https://docs.medusajs.com/mcp to support your learning and development experience with AI agents",
  `Medusa is optimized to build custom commerce software with AI agents through its MCP server and ${terminalLink(
    "Claude Code plugins",
    "https://github.com/medusajs/medusa-claude-plugins"
  )}.`,
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
