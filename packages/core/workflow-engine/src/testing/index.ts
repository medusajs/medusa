import { createEngine, EngineConfig } from "../engine"
import { RunEvent } from "../events/emitter"
import { Clock } from "../runtime/clock"
import { MemoryStore } from "../store/memory/memory-store"

/**
 * A clock whose time only moves when `advance` is called.
 */
export class FakeClock implements Clock {
  #now: number
  #timers = new Map<number, { at: number; fn: () => void }>()
  #nextId = 1

  constructor(start = Date.UTC(2026, 0, 1)) {
    this.#now = start
  }

  now() {
    return this.#now
  }

  setTimeout(fn: () => void, ms: number) {
    const id = this.#nextId++
    this.#timers.set(id, { at: this.#now + Math.max(ms, 0), fn })
    return id
  }

  clearTimeout(handle: unknown) {
    this.#timers.delete(handle as number)
  }

  /**
   * Moves time forward and fires due timers in order, letting promises settle
   * between them.
   */
  async advance(ms: number) {
    const target = this.#now + ms
    for (;;) {
      const due = [...this.#timers.entries()]
        .filter(([, timer]) => timer.at <= target)
        .sort((a, b) => a[1].at - b[1].at)[0]
      if (!due) {
        break
      }
      this.#timers.delete(due[0])
      this.#now = Math.max(this.#now, due[1].at)
      due[1].fn()
      await flushPromises()
    }
    this.#now = target
    await flushPromises()
  }
}

export async function flushPromises(rounds = 20) {
  for (let i = 0; i < rounds; i++) {
    await new Promise((resolve) => setImmediate(resolve))
  }
}

export function createTestEngine(config: EngineConfig = {}) {
  const clock = config.clock
  const store = config.store ?? new MemoryStore({ clock })
  return createEngine({ ...config, store })
}

export function collectEvents(engine: {
  on(listener: (e: RunEvent) => void): unknown
}) {
  const events: RunEvent[] = []
  engine.on((event) => {
    events.push(event)
  })
  return events
}

export { runStoreConformance } from "../store/conformance"
