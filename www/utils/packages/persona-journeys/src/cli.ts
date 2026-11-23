import { spawn } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { CHANNELS, binPath } from "./channels.js"
import {
  PERSONAS_DIR,
  buildConfig,
  listPersonas,
  loadPersona,
} from "./personas.js"
import { startProxy } from "./proxy.js"

const PORT = Number(process.env.PROXY_PORT || 4321)
const START_URL = `http://localhost:${PORT}/`
const RESULTS_DIR = path.resolve(PERSONAS_DIR, "../results")

// Claude Code refuses to start nested sessions while these are set.
const env = { ...process.env }
delete env.CLAUDECODE
delete env.CLAUDE_CODE_ENTRYPOINT

const run = async (bin: string, args: string[], stdout?: fs.WriteStream) =>
  new Promise<number>((resolve) => {
    const child = spawn(process.execPath, [bin, ...args], {
      env,
      stdio: ["ignore", stdout ? "pipe" : "inherit", "inherit"],
    })
    if (stdout) {
      child.stdout?.pipe(stdout)
    }
    child.on("close", (code) => resolve(code ?? 1))
  })

const runStatic = async () => {
  const afdocs = binPath("afdocs", "afdocs")
  await run(
    afdocs,
    ["check", START_URL, "--format", "json"],
    fs.createWriteStream(path.join(RESULTS_DIR, "static.json"))
  )
  return run(afdocs, ["check", START_URL])
}

const runPersona = async (id: string, promptfooArgs: string[]) => {
  const configPath = path.join(RESULTS_DIR, `${id}.config.json`)
  fs.writeFileSync(
    configPath,
    JSON.stringify(buildConfig(id, START_URL), null, 2)
  )
  const { persona } = loadPersona(id)

  return run(binPath("promptfoo", "promptfoo"), [
    "eval",
    "-c",
    configPath,
    "--no-cache",
    "-j",
    String(CHANNELS[persona.channel].concurrency),
    "-o",
    path.join(RESULTS_DIR, `${id}.json`),
    ...promptfooArgs,
  ])
}

const argv = process.argv.slice(2)
const separator = argv.indexOf("--")
const targets = separator === -1 ? argv : argv.slice(0, separator)
const promptfooArgs = separator === -1 ? [] : argv.slice(separator + 1)

const suites =
  !targets.length || targets.includes("all")
    ? ["static", ...listPersonas()]
    : targets
suites.filter((suite) => suite !== "static").forEach((id) => loadPersona(id))

fs.mkdirSync(RESULTS_DIR, { recursive: true })
const proxy = await startProxy(PORT)

let failed = false
for (const suite of suites) {
  const code =
    suite === "static"
      ? await runStatic()
      : await runPersona(suite, promptfooArgs)
  failed ||= code !== 0
}

proxy.close()
process.exitCode = failed ? 1 : 0
