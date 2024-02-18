import { Command } from "../../../../hooks/use-command-history"

type GridCommandArgs = {
  selection: string[]
  setter: (selection: string[], values: string[]) => void
  prev: string[]
  next: string[]
}

export class GridCommand implements Command {
  private _selection: string[]

  private _prev: string[]
  private _next: string[]

  private _setter: (selection: string[], values: string[]) => void

  constructor({ selection, setter, prev, next }: GridCommandArgs) {
    this._selection = selection
    this._setter = setter
    this._prev = prev
    this._next = next
  }

  execute() {
    this._setter(this._selection, this._next)
  }

  undo() {
    this._setter(this._selection, this._prev)
  }

  redo() {
    this.execute()
  }
}
