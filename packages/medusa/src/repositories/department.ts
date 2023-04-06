
import { dataSource } from "../loaders/database"
import { Department } from "../models/department"

export const DepartmentRepository = dataSource.getRepository(Department)
export default DepartmentRepository
