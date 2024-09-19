import { IModuleService } from "../modules-sdk"
import { IndexQueryConfig } from "./query-config"

export interface IIndexService extends IModuleService {
  query<const TEntry extends string>(
    config: IndexQueryConfig<TEntry>
  ): Promise<any[]>
  queryAndCount<const TEntry extends string, Test = IndexQueryConfig<TEntry>>(
    config: IndexQueryConfig<TEntry>
  ): Promise<[any[], number, PerformanceMeasure]>
}
