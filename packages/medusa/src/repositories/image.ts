import { EntityRepository, Repository } from "typeorm"
import { Image } from "../models/image"

@EntityRepository(Image)
export class ImageRepository extends Repository<Image> {}
