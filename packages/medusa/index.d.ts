import { MedusaContainer } from "./src/types/global"

declare module "medusa-interfaces"

import { Customer, User } from "./src/models"
import { FindConfig, RequestQueryFields } from "./src/types/common"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: (User | Customer) & { userId?: string }
      scope: MedusaContainer
      validatedQuery: RequestQueryFields & Record<string, unknown>
      validatedBody: unknown
      listConfig: FindConfig<unknown>
      retrieveConfig: FindConfig<unknown>
      filterableFields: Record<string, unknown>
    }
  }
}
