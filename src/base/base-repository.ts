import { Model, HydratedDocument } from "mongoose"
import { IBaseRepository } from "../interfaces/repositories/i-base-repository"

export class BaseRepository<T> implements IBaseRepository<T> {

  protected model: Model<T>

  constructor(model: Model<T>) {
    this.model = model
  }

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    const document = await this.model.create(data)
    return document
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    return await this.model.findById(id).exec()
  }

  async findAll(filter: Partial<T> = {}): Promise<HydratedDocument<T>[]> {
    return await this.model.find(filter).exec()
  }

  async update(id: string, data: Partial<T>): Promise<HydratedDocument<T> | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec()
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec()
    return result !== null
  }

  async deleteAll(): Promise<boolean> {
    await this.model.deleteMany({}).exec()
    return true
  }

}