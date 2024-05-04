import { Note } from "../models"
import { dataSource } from "../loaders/database"

export const NoteRepository = dataSource.getRepository(Note)
export default NoteRepository
