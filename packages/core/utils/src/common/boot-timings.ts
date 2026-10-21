import { readFileSync } from "fs"

/**
 * Startup profiling: with `MEDUSA_LOG_BOOT_TIMINGS=true`, logs how long each
 * startup phase takes (and when it ended, in seconds since the process
 * started), to see where a slow boot spends its time. Once the server is
 * ready, {@link logBootSummary} adds where the process was stuck: event loop
 * stalls (and the phases running during them), CPU use and throttling, and,
 * in a bundled build, the time spent evaluating code, by package.
 */
export async function timeBoot<T>(
  label: string,
  run: () => Promise<T> | T
): Promise<T> {
  if (!bootTimingsEnabled()) {
    return await run()
  }
  startStallMonitor()
  activePhases.add(label)
  const startedAt = performance.now()
  try {
    return await run()
  } finally {
    activePhases.delete(label)
    console.info(
      `[boot] ${label}: ${Math.round(
        performance.now() - startedAt
      )}ms (done at ${process.uptime().toFixed(2)}s)`
    )
  }
}

const bootTimingsEnabled = () => process.env.MEDUSA_LOG_BOOT_TIMINGS === "true"

/** A stall: the event loop didn't turn for at least this long */
const STALL_MS = 200
const TICK_MS = 20

const activePhases = new Set<string>()
const stalls: { at: number; ms: number; phases: string[] }[] = []
let stallMonitor: NodeJS.Timeout | undefined

function startStallMonitor() {
  if (stallMonitor) {
    return
  }
  let last = performance.now()
  let phasesAtLastTick: string[] = []
  stallMonitor = setInterval(() => {
    const now = performance.now()
    const gap = now - last - TICK_MS
    if (gap >= STALL_MS) {
      stalls.push({
        at: process.uptime() - gap / 1000,
        ms: gap,
        // Phases running when the stall began or ended
        phases: [...new Set([...phasesAtLastTick, ...activePhases])],
      })
    }
    last = now
    phasesAtLastTick = [...activePhases]
  }, TICK_MS)
  stallMonitor.unref()
}

/** Recorded by a bundled build's runtime (see bundle-backend.ts) */
type EvalProfile = {
  /** Seconds since the process started when the bundle's code began running */
  startedAt: number
  /** Self time evaluating each file, in ms, by path */
  self: Map<string, number>
  coldLoads: { count: number; ms: number }
}

const packageOf = (file: string) => {
  const parts = file.split(/[\\/]/)
  const nm = parts.lastIndexOf("node_modules")
  if (nm !== -1 && parts[nm + 1]) {
    return parts[nm + 1].startsWith("@")
      ? `${parts[nm + 1]}/${parts[nm + 2]}`
      : parts[nm + 1]
  }
  // A workspace package linked in development
  const pkg = parts.lastIndexOf("packages")
  if (pkg !== -1 && parts.includes("dist")) {
    return parts[parts.indexOf("dist", pkg) - 1]
  }
  return "<app>"
}

/** A file's path from its package (or the app) on, to keep log lines short */
const shortPath = (file: string) => {
  const nm = file.lastIndexOf("node_modules/")
  if (nm !== -1) {
    return file.slice(nm + "node_modules/".length)
  }
  return file.startsWith(process.cwd() + "/")
    ? file.slice(process.cwd().length + 1)
    : file
}

const ms = (value: number) => `${Math.round(value)}ms`

const top = (entries: Map<string, number>, count: number) =>
  [...entries]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([name, time]) => `${name} ${ms(time)}`)
    .join(", ")

/** The container's CPU throttling (cgroup v2), when it's readable */
function readCpuThrottling() {
  try {
    const stat = Object.fromEntries(
      readFileSync("/sys/fs/cgroup/cpu.stat", "utf8")
        .trim()
        .split("\n")
        .map((line) => line.split(" "))
    )
    const max = readFileSync("/sys/fs/cgroup/cpu.max", "utf8").trim()
    return `cpu.max ${max}, throttled ${stat.nr_throttled}/${
      stat.nr_periods
    } periods for ${ms(Number(stat.throttled_usec) / 1000)}`
  } catch {
    return undefined
  }
}

/**
 * Logs where the boot spent its time; call once the server is ready.
 */
export function logBootSummary() {
  if (!bootTimingsEnabled()) {
    return
  }
  if (stallMonitor) {
    clearInterval(stallMonitor)
  }
  const uptime = process.uptime()
  const cpu = process.cpuUsage()
  const cpuSeconds = (cpu.user + cpu.system) / 1e6
  const lines = [
    `ready at ${uptime.toFixed(2)}s, cpu ${cpuSeconds.toFixed(2)}s (user ${(
      cpu.user / 1e6
    ).toFixed(2)}s, system ${(cpu.system / 1e6).toFixed(2)}s, ${Math.round(
      (cpuSeconds / uptime) * 100
    )}% of one core)`,
  ]
  const throttling = readCpuThrottling()
  if (throttling) {
    lines.push(throttling)
  }

  const profile = (globalThis as any).__MEDUSA_BOOT_EVAL_PROFILE__ as
    | EvalProfile
    | undefined
  if (profile) {
    const byPackage = new Map<string, number>()
    const byFile = new Map<string, number>()
    let total = 0
    for (const [file, time] of profile.self) {
      const pkg = packageOf(file)
      byPackage.set(pkg, (byPackage.get(pkg) ?? 0) + time)
      byFile.set(shortPath(file), time)
      total += time
    }
    lines.push(
      `bundle code started running at ${profile.startedAt.toFixed(2)}s`,
      `evaluating code: ${ms(total)} in ${profile.self.size} files, ${
        profile.coldLoads.count
      } loaded on first use (${ms(profile.coldLoads.ms)} to load them)`,
      `evaluating code by package: ${top(byPackage, 20)}`,
      `slowest files to evaluate: ${top(byFile, 15)}`
    )
  }

  const stalled = stalls.reduce((sum, stall) => sum + stall.ms, 0)
  lines.push(
    `event loop blocked ${stalls.length} times for >=${STALL_MS}ms, ${ms(
      stalled
    )} in total`,
    ...stalls
      .sort((a, b) => b.ms - a.ms)
      .slice(0, 15)
      .map(
        (stall) =>
          `  stall of ${ms(stall.ms)} from ${stall.at.toFixed(2)}s during: ${
            stall.phases.join(", ") || "(no phase)"
          }`
      )
  )
  for (const line of lines) {
    console.info(`[boot] ${line}`)
  }
}
