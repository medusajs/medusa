import { WorkflowArguments } from "../../helper"

type ConfigDTO = {
  select?: string[]
  relations?: string[]
}

enum Aliases {
  Config = "config",
}

type HandlerInputData = {
  config: {
    select?: string[]
    relations?: string[]
  }
}

export async function setConfig({
  data,
}: WorkflowArguments<HandlerInputData>): Promise<ConfigDTO> {
  return data[Aliases.Config]
}

setConfig.aliases = Aliases
