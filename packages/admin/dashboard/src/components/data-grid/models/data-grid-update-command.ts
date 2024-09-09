import { Command } from "../../../hooks/use-command-history"

export type DataGridUpdateCommandArgs = {
  prev: any
  next: any
  setter: (value: any) => void
}

export class DataGridUpdateCommand implements Command {
  private _prev: any
  private _next: any

  private _setter: (value: any) => void

  constructor({ prev, next, setter }: DataGridUpdateCommandArgs) {
    this._prev = prev
    this._next = next

    this._setter = setter
  }

  execute(): void {
    this._setter(this._next)
  }

  undo(): void {
    this._setter(this._prev)
  }

  redo(): void {
    this.execute()
  }
}