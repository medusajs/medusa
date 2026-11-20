import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { UnifiedConfig } from "promptfoo"
import { parse } from "yaml"
import * as checks from "./assertions.js"
import { Assertion, CHANNELS, ChannelName, check } from "./channels.js"

export type Persona = {
  id: string
  name: string
  description: string
  channel: ChannelName
  profile: string
  assert?: Assertion[]
}

export type Journey = {
  description: string
  vars: Record<string, string>
  assert?: Assertion[]
}

export const PERSONAS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../personas"
)

const GRADER = {
  id: "anthropic:claude-agent-sdk",
  config: { apiKeyRequired: false, model: "sonnet", tools: [], max_turns: 1 },
}

const readYaml = <T>(file: string): T => parse(fs.readFileSync(file, "utf8"))

export const listPersonas = () =>
  fs
    .readdirSync(PERSONAS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

export const loadPersona = (id: string) => {
  const dir = path.join(PERSONAS_DIR, id)
  if (!fs.existsSync(path.join(dir, "persona.yaml"))) {
    throw new Error(
      `Unknown persona "${id}". Available: ${listPersonas().join(", ")}`
    )
  }
  const persona: Persona = {
    id,
    ...readYaml<Omit<Persona, "id">>(path.join(dir, "persona.yaml")),
  }
  if (!CHANNELS[persona.channel]) {
    throw new Error(
      `Persona "${id}" has unknown channel "${persona.channel}". Available: ${Object.keys(CHANNELS).join(", ")}`
    )
  }
  const journeys = readYaml<Journey[]>(path.join(dir, "journeys.yaml"))
  return { persona, journeys }
}

// `javascript` assertions can name a check exported from assertions.ts.
const resolveChecks = (assertions: Assertion[] = []) =>
  assertions.map((assertion) => {
    const isCheck =
      assertion.type === "javascript" &&
      typeof assertion.value === "string" &&
      assertion.value in checks
    return isCheck
      ? { ...assertion, value: check(assertion.value as string) }
      : assertion
  })

export const buildConfig = (
  id: string,
  startUrl: string
): Partial<UnifiedConfig> => {
  const { persona, journeys } = loadPersona(id)
  const channel = CHANNELS[persona.channel]

  return {
    description: `${persona.name}: ${persona.description}`,
    prompts: [channel.prompt(startUrl)],
    providers: [
      {
        id: "anthropic:claude-agent-sdk",
        label: persona.id,
        config: {
          apiKeyRequired: false,
          model: "sonnet",
          max_turns: channel.maxTurns,
          tools: [],
          permission_mode: "bypassPermissions",
          allow_dangerously_skip_permissions: true,
          mcp: { servers: [channel.mcp] },
          append_system_prompt: persona.profile,
        },
      },
    ],
    defaultTest: {
      options: { provider: GRADER },
      assert: [...channel.assert, ...resolveChecks(persona.assert)],
    },
    tests: journeys.map((journey) => ({
      ...journey,
      assert: resolveChecks(journey.assert),
    })),
  } as Partial<UnifiedConfig>
}
