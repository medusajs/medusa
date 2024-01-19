import { DALUtils } from "@medusajs/utils"

import { Capture } from "@models"
import { CreateCaptureDTO } from "@medusajs/types"

export class CaptureRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Capture,
  {
    create: CreateCaptureDTO
  }
>(Capture) {}
