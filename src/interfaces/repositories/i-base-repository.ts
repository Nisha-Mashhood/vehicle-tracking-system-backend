import { HydratedDocument } from "mongoose"

export interface IBaseRepository<T> {

  create(data: Partial<T>): Promise<HydratedDocument<T>>

  findById(id: string): Promise<HydratedDocument<T> | null>

  findAll(filter?: Partial<T>): Promise<HydratedDocument<T>[]>

  update(id: string, data: Partial<T>): Promise<HydratedDocument<T> | null>

  deleteById(id: string): Promise<boolean>

  deleteAll(): Promise<boolean>

}