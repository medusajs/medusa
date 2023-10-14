import { IModuleService } from "../modules-sdk"

export interface ICatalogModuleService extends IModuleService {
  query(...args): Promise<any>
  queryAndCount(...args): Promise<any>
}
