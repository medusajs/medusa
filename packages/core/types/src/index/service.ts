import { IModuleService } from "../modules-sdk"

type OrderBy = {
  [key: string]: OrderBy | "ASC" | "DESC" | 1 | -1 | true | false
}

export type IndexQueryConfig = {
  fields: string[]
  filters?: Record<string, any>
  joinFilters?: Record<string, any>
  pagination?: {
    skip?: number
    take?: number
    orderBy?: OrderBy
  }
  keepFilteredEntities?: boolean
}

export interface IIndexService extends IModuleService {
  query(config: IndexQueryConfig): Promise<any[]>
  queryAndCount(
    config: IndexQueryConfig
  ): Promise<[any[], number, PerformanceMeasure]>
}
