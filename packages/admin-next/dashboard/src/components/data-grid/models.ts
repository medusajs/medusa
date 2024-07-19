import { Command } from "../../hooks/use-command-history"

/**
 * A sorted set implementation that uses binary search to find the insertion index.
 */
export class SortedSet<T> {
  private items: T[] = []

  constructor(initialItems?: T[]) {
    if (initialItems) {
      this.insertMultiple(initialItems)
    }
  }

  insert(value: T): void {
    const insertionIndex = this.findInsertionIndex(value)

    if (this.items[insertionIndex] !== value) {
      this.items.splice(insertionIndex, 0, value)
    }
  }

  remove(value: T): void {
    const index = this.findInsertionIndex(value)

    if (this.items[index] === value) {
      this.items.splice(index, 1)
    }
  }

  getPrev(value: T): T | null {
    const index = this.findInsertionIndex(value)
    if (index === 0) {
      return null
    }

    return this.items[index - 1]
  }

  getNext(value: T): T | null {
    const index = this.findInsertionIndex(value)

    if (index === this.items.length - 1) {
      return null
    }

    return this.items[index + 1]
  }

  getFirst(): T | null {
    if (this.items.length === 0) {
      return null
    }

    return this.items[0]
  }

  getLast(): T | null {
    if (this.items.length === 0) {
      return null
    }

    return this.items[this.items.length - 1]
  }

  toArray(): T[] {
    return [...this.items]
  }

  private insertMultiple(values: T[]): void {
    values.forEach((value) => this.insert(value))
  }

  private findInsertionIndex(value: T): number {
    let left = 0
    let right = this.items.length - 1
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (this.items[mid] === value) {
        return mid
      } else if (this.items[mid] < value) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    return left
  }
}

export type PasteCommandArgs = {
  selection: Record<string, boolean>
  next: string[]
  prev: string[]
  setter: (selection: Record<string, boolean>, values: string[]) => void
}

export class PasteCommand implements Command {
  private _selection: Record<string, boolean>

  private _prev: string[]
  private _next: string[]

  private _setter: (
    selection: Record<string, boolean>,
    values: string[]
  ) => void

  constructor({ selection, prev, next, setter }: PasteCommandArgs) {
    this._selection = selection
    this._prev = prev
    this._next = next
    this._setter = setter
  }

  execute(): void {
    this._setter(this._selection, this._next)
  }
  undo(): void {
    this._setter(this._selection, this._prev)
  }
  redo(): void {
    this.execute()
  }
}

export type UpdateCommandArgs = {
  prev: any
  next: any
  setter: (value: any) => void
}

export class UpdateCommand implements Command {
  private _prev: any
  private _next: any

  private _setter: (value: any) => void

  constructor({ prev, next, setter }: UpdateCommandArgs) {
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
