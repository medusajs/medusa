import { EntityRepository, Repository } from "typeorm"
import { Swap } from "../models/swap"

@EntityRepository(Swap)
export class SwapRepository extends Repository<Swap> {}
