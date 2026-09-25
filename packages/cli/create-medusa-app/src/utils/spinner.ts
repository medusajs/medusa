import { log, spinner, SpinnerResult } from "@clack/prompts"
import chalk from "chalk"

const DETAIL_INTERVAL = 10000

export default class Spinner {
  private spinner: SpinnerResult = spinner({ indicator: "timer" })
  private isActive = false
  private detailInterval: NodeJS.Timeout | null = null

  constructor(private verbose = false) {}

  start(message: string, getDetail?: () => string) {
    if (this.verbose) {
      log.step(message)
      return
    }

    this.clearDetailInterval()

    const render = () =>
      getDetail
        ? `${message}\n${chalk.gray("│")}  ${chalk.dim(getDetail())}`
        : message

    if (this.isActive) {
      this.spinner.message(render())
    } else {
      this.spinner.start(render())
      this.isActive = true
    }

    if (getDetail) {
      this.detailInterval = setInterval(
        () => this.spinner.message(render()),
        DETAIL_INTERVAL
      )
      this.detailInterval.unref()
    }
  }

  succeed(message: string) {
    this.clearDetailInterval()

    if (!this.isActive) {
      log.success(message)
      return
    }

    this.spinner.stop(message)
    this.isActive = false
  }

  stop() {
    this.clearDetailInterval()

    if (!this.isActive) {
      return
    }

    this.spinner.clear()
    this.isActive = false
  }

  private clearDetailInterval() {
    if (this.detailInterval) {
      clearInterval(this.detailInterval)
      this.detailInterval = null
    }
  }
}
