import { IModuleService } from "../../modules-sdk"

export interface ISearchModuleService extends IModuleService {
  query(...args): Promise<any>
  queryAndCount(...args): Promise<any>
}
