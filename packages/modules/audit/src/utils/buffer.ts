import { AuditLogDTO, Logger } from "@medusajs/framework/types"

export const DEFAULT_BUFFER_MAX_SIZE = 100
export const DEFAULT_BUFFER_FLUSH_INTERVAL_MS = 1000
export const DEFAULT_BUFFER_MAX_BUFFERED = 10_000
export const DEFAULT_WRITE_ATTEMPTS = 3
export const DEFAULT_RETRY_DELAY_MS = 200

export type AuditBufferOptions = {
  write: (entries: AuditLogDTO[]) => Promise<void>
  logger: Pick<Logger, "warn" | "error">
  maxSize?: number
  flushIntervalMs?: number
  maxBuffered?: number
  writeAttempts?: number
  retryDelayMs?: number
}

/**
 * Holds recorded audit logs in memory and writes them in batches, when the
 * buffer reaches `maxSize` or `flushIntervalMs` after the first pending entry.
 * Nothing in it rejects: a batch that still fails after `writeAttempts` is
 * dropped and logged.
 */
export class AuditBuffer {
  protected readonly write_: AuditBufferOptions["write"]
  protected readonly logger_: AuditBufferOptions["logger"]
  protected readonly maxSize_: number
  protected readonly flushIntervalMs_: number
  protected readonly maxBuffered_: number
  protected readonly writeAttempts_: number
  protected readonly retryDelayMs_: number

  protected entries_: AuditLogDTO[] = []
  protected timer_?: NodeJS.Timeout
  protected draining_?: Promise<void>

  constructor(options: AuditBufferOptions) {
    this.write_ = options.write
    this.logger_ = options.logger
    this.maxSize_ = AuditBuffer.positive_(
      options.maxSize,
      DEFAULT_BUFFER_MAX_SIZE
    )
    this.flushIntervalMs_ = AuditBuffer.positive_(
      options.flushIntervalMs,
      DEFAULT_BUFFER_FLUSH_INTERVAL_MS
    )
    this.maxBuffered_ = Math.max(
      AuditBuffer.positive_(options.maxBuffered, DEFAULT_BUFFER_MAX_BUFFERED),
      this.maxSize_
    )
    this.writeAttempts_ = AuditBuffer.positive_(
      options.writeAttempts,
      DEFAULT_WRITE_ATTEMPTS
    )
    this.retryDelayMs_ = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS
  }

  get size(): number {
    return this.entries_.length
  }

  push(entries: AuditLogDTO[]): void {
    if (!entries.length) {
      return
    }

    this.entries_.push(...entries)

    const overflow = this.entries_.length - this.maxBuffered_
    if (overflow > 0) {
      this.entries_.splice(0, overflow)
      this.logger_.warn(
        `Audit: the buffer exceeded ${this.maxBuffered_} pending audit logs, dropped the ${overflow} oldest.`
      )
    }

    if (this.entries_.length >= this.maxSize_) {
      void this.flush()
      return
    }

    this.schedule_()
  }

  /**
   * Writes everything pending, including entries pushed while it runs. Calls
   * made during a drain share it.
   */
  flush(): Promise<void> {
    this.draining_ ??= this.drain_().finally(() => {
      this.draining_ = undefined
      if (this.entries_.length) {
        this.schedule_()
      }
    })

    return this.draining_
  }

  stop(): void {
    if (this.timer_) {
      clearTimeout(this.timer_)
      this.timer_ = undefined
    }
  }

  protected schedule_(): void {
    if (this.timer_ || this.draining_) {
      return
    }

    this.timer_ = setTimeout(() => {
      this.timer_ = undefined
      void this.flush()
    }, this.flushIntervalMs_)
    // A pending flush must not keep the process alive; shutdown flushes instead.
    this.timer_.unref?.()
  }

  protected async drain_(): Promise<void> {
    this.stop()

    while (this.entries_.length) {
      const batch = this.entries_.splice(0, this.maxSize_)
      await this.writeWithRetry_(batch)
    }
  }

  protected async writeWithRetry_(batch: AuditLogDTO[]): Promise<void> {
    let lastError: unknown

    for (let attempt = 1; attempt <= this.writeAttempts_; attempt++) {
      try {
        await this.write_(batch)
        return
      } catch (error) {
        lastError = error
        if (attempt < this.writeAttempts_) {
          await this.delay_(this.retryDelayMs_ * 2 ** (attempt - 1))
        }
      }
    }

    // Never log the entries themselves: they can hold personal data.
    this.logger_.error(
      `Audit: dropped ${batch.length} audit log(s) after ${
        this.writeAttempts_
      } failed write attempt(s): ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`
    )
  }

  protected static positive_(
    value: number | undefined,
    fallback: number
  ): number {
    return typeof value === "number" && Number.isFinite(value) && value > 0
      ? Math.floor(value)
      : fallback
  }

  protected delay_(ms: number): Promise<void> {
    if (ms <= 0) {
      return Promise.resolve()
    }

    // Not unref'd: a shutdown flush waiting on a retry must keep the process alive.
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
