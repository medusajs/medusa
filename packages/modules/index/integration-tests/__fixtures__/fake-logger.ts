import { Logger } from "@medusajs/framework/types"

/**
 * In-memory logger that records every log entry. Errors are collected
 * separately so the test bed can fail loudly when the module swallows
 * exceptions and only reports them through the logger.
 */
export class FakeLogger {
  logs: { level: string; args: unknown[] }[] = []
  errors: unknown[] = []

  protected record(level: string, args: unknown[]) {
    this.logs.push({ level, args })

    if (level === "error") {
      this.errors.push(args[0])
    }
  }

  info(...args: unknown[]) {
    this.record("info", args)
  }

  warn(...args: unknown[]) {
    this.record("warn", args)
  }

  error(...args: unknown[]) {
    this.record("error", args)
  }

  debug(...args: unknown[]) {
    this.record("debug", args)
  }

  log(...args: unknown[]) {
    this.record("log", args)
  }

  panic(...args: unknown[]) {
    this.record("panic", args)
  }

  failure(...args: unknown[]) {
    this.record("failure", args)
  }

  success(...args: unknown[]) {
    this.record("success", args)
  }

  progress(...args: unknown[]) {
    this.record("progress", args)
  }

  activity(...args: unknown[]) {
    this.record("activity", args)
  }

  shouldLog(): boolean {
    return true
  }

  setLogLevel(): void {}

  unsetLogLevel(): void {}

  asLogger(): Logger {
    return this as unknown as Logger
  }
}
