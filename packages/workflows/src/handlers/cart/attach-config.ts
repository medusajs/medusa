import { WorkflowArguments } from "../../helper"

type ConfigDTO = {
  retrieveConfig: {
    select?: string[]
    relations?: string[]
  }
}

enum Aliases {
  Config = "config",
}

type HandlerInputData = {
  config: {
    config: {
      retrieveConfig?: {
        select?: string[]
        relations?: string[]
      }
    }
  }
}

export async function attachConfig({
  container,
  context,
  data,
}: WorkflowArguments<HandlerInputData>): Promise<ConfigDTO> {
  const config = data[Aliases.Config].config

  const configDTO: ConfigDTO = {
    retrieveConfig: config.retrieveConfig || {
      select: [],
      relations: [],
    },
  }

  return configDTO
}

attachConfig.aliases = Aliases
