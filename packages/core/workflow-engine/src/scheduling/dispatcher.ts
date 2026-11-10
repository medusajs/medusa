import { Clock, jittered } from "../runtime/clock"
import { ClaimedSchedule, Store, TimerRecord } from "../store/store"

// Polls are up to this much shorter than the interval, so instances that
// started together do not poll at once.
const POLL_JITTER = 0.2
// Bounds the wake-up times kept; the latest ones are dropped first and caught
// by polling.
const MAX_HINTS = 1000

/**
 * Stores for which asking when the next timer is due is free, such as the
 * memory store, implement this so the dispatcher sleeps until then instead of
 * polling.
 */
type NextTimerAware = Store & {
  nextTimerDueAt?(workflowIds?: string[]): Promise<Date | null>
}

export interface DispatcherOptions {
  store: NextTimerAware
  clock: Clock
  owner: string
  pollIntervalMs: number
  batchSize: number
  claimMs: number
  mismatchGraceMs: number
  /**
   * How many more runs this instance may take on.
   */
  capacity(): number
  known(): Array<{ workflowId: string; hash: string }>
  scheduledWorkflows(): string[]
  onTimer(timer: TimerRecord): Promise<void>
  onSchedule(claimed: ClaimedSchedule): Promise<void>
  onError(message: string, error: unknown): void
}

/**
 * Claims due timers and schedules, one batch at a time, and hands them to the
 * engine. Idle, it waits for the poll interval or a wake-up.
 */
export class Dispatcher {
  #running = false
  #loop: Promise<void> | undefined
  #inflight = new Set<Promise<void>>()
  #wake: (() => void) | undefined
  #woken = false
  // Times at which work is known to become due, earliest first, and when the
  // current sleep ends.
  #hints: number[] = []
  #sleepUntil: number | undefined

  constructor(private readonly options: DispatcherOptions) {}

  get inflight() {
    return this.#inflight.size
  }

  start() {
    if (this.#running) {
      return
    }
    this.#running = true
    this.#loop = this.#run()
  }

  async stop() {
    this.#running = false
    this.wake()
    await this.#loop
    await Promise.allSettled([...this.#inflight])
  }

  wake() {
    this.#woken = true
    this.#wake?.()
  }

  /**
   * Makes the dispatcher check for due work at the given time, rather than at
   * its next poll.
   */
  wakeAt(at: Date) {
    const time = at.getTime()
    const index = this.#hints.findIndex((hint) => hint >= time)
    if (this.#hints[index] !== time) {
      this.#hints.splice(index === -1 ? this.#hints.length : index, 0, time)
      this.#hints.length = Math.min(this.#hints.length, MAX_HINTS)
    }
    if (this.#sleepUntil !== undefined && time < this.#sleepUntil) {
      this.#wake?.()
    }
  }

  async #run() {
    while (this.#running) {
      this.#woken = false
      let claimed = 0
      try {
        claimed = await this.#claim()
      } catch (error) {
        this.options.onError("Failed to claim due work", error)
      }
      if (!this.#running) {
        break
      }
      if (claimed === 0 && !this.#woken) {
        await this.#sleep()
      } else {
        await new Promise((resolve) => setImmediate(resolve))
      }
    }
  }

  async #claim(): Promise<number> {
    const { store, owner, batchSize, claimMs, mismatchGraceMs } = this.options
    const capacity = this.options.capacity() - this.#inflight.size
    if (capacity <= 0) {
      return 0
    }

    const timers = await store.claimDueTimers(
      owner,
      Math.min(batchSize, capacity),
      this.options.known(),
      { claimMs, mismatchGraceMs }
    )
    for (const timer of timers) {
      this.#track(this.options.onTimer(timer), `timer ${timer.id}`)
    }

    const scheduled = this.options.scheduledWorkflows()
    const schedules = scheduled.length
      ? await store.claimDueSchedules(owner, batchSize, scheduled, claimMs)
      : []
    for (const schedule of schedules) {
      this.#track(
        this.options.onSchedule(schedule),
        `schedule ${schedule.schedule.workflowId}`
      )
    }

    return timers.length + schedules.length
  }

  #track(task: Promise<void>, description: string) {
    const tracked = task
      .catch((error) =>
        this.options.onError(`Failed to handle ${description}`, error)
      )
      .finally(() => {
        this.#inflight.delete(tracked)
        this.wake()
      })
    this.#inflight.add(tracked)
  }

  /**
   * Only a timer due in the future shortens the sleep. One that is already due
   * but was not claimed (no capacity, or a claim still running) would
   * otherwise make the loop spin.
   */
  async #sleep() {
    const { clock, pollIntervalMs } = this.options
    let delay = jittered(pollIntervalMs, POLL_JITTER)
    const capacity = this.options.capacity() - this.#inflight.size
    const next =
      capacity > 0
        ? await this.options.store.nextTimerDueAt?.(
            this.options.known().map((k) => k.workflowId)
          )
        : null
    if (next) {
      const until = next.getTime() - clock.now()
      if (until > 0) {
        delay = Math.min(delay, until)
      }
    }
    const now = clock.now()
    while (this.#hints.length && this.#hints[0] <= now) {
      this.#hints.shift()
    }
    if (this.#hints.length) {
      delay = Math.min(delay, this.#hints[0] - now)
    }
    this.#sleepUntil = clock.now() + delay

    await new Promise<void>((resolve) => {
      const handle = clock.setTimeout(() => {
        this.#wake = undefined
        this.#sleepUntil = undefined
        resolve()
      }, delay)
      this.#wake = () => {
        clock.clearTimeout(handle)
        this.#wake = undefined
        this.#sleepUntil = undefined
        resolve()
      }
      if (this.#woken || !this.#running) {
        this.#wake()
      }
    })
  }
}
