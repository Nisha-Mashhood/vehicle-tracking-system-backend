export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>

  findById(id: string): Promise<T | null>

  findAll(filter?: Partial<T>): Promise<T[]>

  update(id: string, data: Partial<T>): Promise<T | null>

  deleteById(id: string): Promise<boolean>

  deleteAll(): Promise<boolean>
}