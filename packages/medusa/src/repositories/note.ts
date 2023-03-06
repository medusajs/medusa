import { dataSource } from "../loaders/database"
import { Note } from "../models"

export const NoteRepository = dataSource.getRepository(Note)
export default NoteRepository
