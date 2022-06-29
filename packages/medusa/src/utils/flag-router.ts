import { IFlagRouter } from "../types/feature-flags"

export class FlagRouter implements IFlagRouter {
  private flags: Record<string, boolean> = {}

  constructor(flags: Record<string, boolean>) {
    this.flags = flags
  }

  public featureIsEnabled(key: string): boolean {
    return this.flags[key]
  }
}
