import { ChildProcess, fork } from "child_process"
import path from "path"

export interface WorkerProcess {
  name: string
  child: ChildProcess
  call<T = any>(cmd: string, args?: unknown): Promise<T>
  kill(signal?: NodeJS.Signals): void
}

/**
 * Forks an engine instance that runs the TypeScript sources directly.
 */
export async function spawnWorker(
  name: string,
  env: { databaseUrl: string; mode?: string; schedule?: boolean }
): Promise<WorkerProcess> {
  const child = fork(path.join(__dirname, "../__fixtures__/worker.ts"), [], {
    execArgv: ["-r", "ts-node/register/transpile-only"],
    env: {
      ...process.env,
      INSTANCE: name,
      DATABASE_URL: env.databaseUrl,
      MODE: env.mode ?? "shared",
      SCHEDULE: env.schedule ? "1" : "0",
      TS_NODE_COMPILER_OPTIONS: JSON.stringify({
        module: "commonjs",
        moduleResolution: "node",
      }),
    },
    stdio: ["ignore", "inherit", "inherit", "ipc"],
  })

  let nextId = 0
  const pending = new Map<number, { resolve: Function; reject: Function }>()
  const ready = new Promise<void>((resolve, reject) => {
    child.on("message", (message: any) => {
      if (message.ready) {
        resolve()
        return
      }
      const waiter = pending.get(message.id)
      if (waiter) {
        pending.delete(message.id)
        message.error
          ? waiter.reject(new Error(message.error))
          : waiter.resolve(message.result)
      }
    })
    child.on("exit", (code, signal) => {
      const error = new Error(`Worker ${name} exited (${code ?? signal})`)
      reject(error)
      for (const waiter of pending.values()) {
        waiter.reject(error)
      }
      pending.clear()
    })
  })
  await ready

  return {
    name,
    child,
    call(cmd, args) {
      const id = ++nextId
      return new Promise((resolve, reject) => {
        if (child.exitCode !== null || child.signalCode !== null) {
          reject(new Error(`Worker ${name} exited`))
          return
        }
        pending.set(id, { resolve, reject })
        child.send({ id, cmd, args }, (error) => {
          if (error && pending.delete(id)) {
            reject(error)
          }
        })
      })
    },
    kill(signal = "SIGKILL") {
      child.kill(signal)
    },
  }
}
