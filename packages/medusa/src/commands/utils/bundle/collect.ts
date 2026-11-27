import type { Collected } from "@medusajs/bundler"
import { fork } from "child_process"
import { rmSync } from "fs"
import { mkdtemp, readFile } from "fs/promises"
import os from "os"
import path from "path"

/**
 * Runs the collection pass in its own process, from the compiled output.
 */
export async function collectBuildManifest(outDir: string): Promise<Collected> {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "medusa-collect-"))
  const outputFile = path.join(tmp, "collected.json")
  try {
    await new Promise<void>((resolve, reject) => {
      // The child's stdout is kept to report when it fails, and dropped when
      // it succeeds. stderr goes straight to ours.
      const stdout: Buffer[] = []
      const child = fork(
        path.join(__dirname, "collect-runner.js"),
        [outputFile],
        {
          cwd: outDir,
          // Collect what production boots, whatever mode the build runs in
          env: { ...process.env, NODE_ENV: "production" },
          stdio: ["ignore", "pipe", "inherit", "ipc"],
        }
      )
      child.stdout?.on("data", (chunk: Buffer) => stdout.push(chunk))
      child.on("error", reject)
      child.on("exit", (code) => {
        if (code === 0) {
          return resolve()
        }
        const output = Buffer.concat(stdout).toString("utf8").trim()
        reject(
          new Error(
            `Collecting the build manifest failed (exit ${code})` +
              (output ? `\nOutput of the collection pass:\n${output}` : "")
          )
        )
      })
    })
    return JSON.parse(await readFile(outputFile, "utf8")) as Collected
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}
