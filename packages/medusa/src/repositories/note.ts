import { EntityRepository, Repository } from "typeorm"
import { Note } from "../models/note"

@EntityRepository(Note)
export class NoteRepository extends Repository<Note> {}
