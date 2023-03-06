import { dataSource } from "../loaders/database"
import { Swap } from "../models"

export const SwapRepository = dataSource.getRepository(Swap)
export default SwapRepository
