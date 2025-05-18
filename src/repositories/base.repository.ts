// import { Model, raw } from 'objection';
import { Model, Schema} from 'mongoose';
import { ObjectLiteral } from '../shared/types/general.type';


export abstract class BaseRepository<T, M extends any> {
  private model: typeof Schema | any;

  constructor(model: M | any) {
    this.model = model;
  }

  async getAll(): Promise<Array<T>> {
    return await this.model.query();
  }

  async getAllWhere(args: object): Promise<Array<T>> {
    return await this.model.query().where(args);
  }

  async getOneWhere(args: object): Promise<T | undefined> {
    return (await this.model.query().where(args))[0];
  }

  async findOne<VT>(columnName: string, value: VT): Promise<T | undefined> {
    return await this.model.query().findOne(columnName, value);
  }

  // async findById(id: string): Promise<T | undefined> {
  //   return await this.model.query().findById(id);
  // }

  // async save(
  //   data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>,
  //   transaction?: Transaction,
  // ): Promise<T> {
  //   // return await this.model.query(transaction).insertAndFetch(data);
  //   return await this.model.query(transaction).insert(data).returning('*');
  // }

  async update(id: string, data: Partial<T>): Promise<T> {
    return await this.model.query().patchAndFetchById(id, data);
  }

  async deleteRecordById(id: string): Promise<boolean> {
    const isDeleted = await this.model.query().deleteById(id);
    if (isDeleted) return true;
    return false;
  }

  async deleteRecordWhere(args: ObjectLiteral): Promise<boolean> {
    const isDeleted = await this.model.query().delete().where(args);
    if (isDeleted) return true;
    return false;
  }

  async getOtherRecordsWithName<T>(id: T, columnName: string, name: string) {
    return await this.model.query().whereNot('id', id).andWhere(columnName, name);
  }
}
