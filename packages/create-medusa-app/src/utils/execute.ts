import { exec, spawnSync, SpawnSyncOptions } from "child_process"
import util from "util"
import { getAbortError } from "./create-abort-controller.js"

const promiseExec = util.promisify(exec)

type ExecuteOptions = {
  stdout?: string
  stderr?: string
}

type VerboseOptions = {
  verbose?: boolean
  // Since spawn doesn't allow us to both retrieve the
  // output and output it live without using events,
  // enabling this option, which is only useful if `verbose` is `true`,
  // defers the output of the process until after the process is executed
  // instead of outputting the log in realtime, which is the default.
  // it prioritizes retrieving the output over outputting it in real-time.
  needOutput?: boolean
}

type PromiseExecParams = Parameters<typeof promiseExec>
type SpawnParams = [string, SpawnSyncOptions]

const execute = async (
  command: SpawnParams | PromiseExecParams,
  { verbose = false, needOutput = false }: VerboseOptions
): Promise<ExecuteOptions> => {
  if (verbose) {
    const [commandStr, options] = command as SpawnParams
    const childProcess = spawnSync(commandStr, {
      ...options,
      shell: true,
      stdio: needOutput
        ? "pipe"
        : [process.stdin, process.stdout, process.stderr],
    })

    if (childProcess.error) {
      throw childProcess.error
    }

    if (
      childProcess.signal &&
      ["SIGINT", "SIGTERM"].includes(childProcess.signal)
    ) {
      console.log("abortingggg")
      throw getAbortError()
    }

    if (needOutput) {
      console.log(
        childProcess.stdout?.toString() || childProcess.stderr?.toString()
      )
    }

    return {
      stdout: childProcess.stdout?.toString() || "",
      stderr: childProcess.stderr?.toString() || "",
    }
  } else {
    const childProcess = await promiseExec(...(command as PromiseExecParams))

    return {
      stdout: childProcess.stdout as string,
      stderr: childProcess.stderr as string,
    }
  }
}

export default execute
