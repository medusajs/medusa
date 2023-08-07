import { WorkflowArguments } from "../../helper"

type ConfigDTO = {
  retrieveConfig?: {
    select?: string[]
    relations?: string[]
  }
}

enum Aliases {
  Config = "config",
}

type HandlerInputData = {
  config: {
    retrieveConfig?: {
      select?: string[]
      relations?: string[]
    }
  }
}

export async function attachConfig({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<ConfigDTO> {
  return {
    retrieveConfig: data[Aliases.Config].retrieveConfig,
  }
}

attachConfig.aliases = Aliases
