import { IsDate } from "class-validator"

export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
}

export interface FindConfig<Entity> {
  select?: (keyof Entity)[]
  skip?: number
  take?: number
  relations?: string[]
  order?: "ASC" | "DESC"
}

export type PaginatedResponse = { limit: number; offset: number; count: number }

export class DateFilter {
  @IsDate()
  lt?: Date | string

  @IsDate()
  gt?: Date | string

  @IsDate()
  gte?: Date | string

  @IsDate()
  lte?: Date | string
}
