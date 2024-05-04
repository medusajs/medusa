import { Swap } from "../models"
import { dataSource } from "../loaders/database"

export const SwapRepository = dataSource.getRepository(Swap)
export default SwapRepository
