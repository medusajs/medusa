import { IFlagRouter } from "../types/feature-flags"

export class FlagRouter implements IFlagRouter {
  private flags: Record<string, boolean> = {}

  constructor(flags: Record<string, boolean>) {
    this.flags = flags
  }

  public isFeatureEnabled(key: string): boolean {
    return !!this.flags[key]
  }

  public setFlag(key: string, value = true): void {
    this.flags[key] = value
  }
}
