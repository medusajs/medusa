import { IModuleService } from "../modules-sdk"

export interface IIndexService extends IModuleService {
  query(...args): Promise<any>
  queryAndCount(...args): Promise<any>
}
