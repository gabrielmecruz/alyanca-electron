import { find, findAll, insert, updateAllById, deleteOneId } from '../helpers/queries.js'

interface UpdateAllByIdType {
  values: any[] | any,
  id: number
}

class Model {
  tableName;
  columns;
  primary_key;
  constructor(tableName: any, columns: any, primary_key: string) {
    this.tableName = tableName
    this.columns = columns
    this.primary_key = primary_key
  }

  all() {
    return findAll(this.tableName)
  }

  find(id: number): any {
    return find({
      tableName: this.tableName,
      id: id,
      key: this.primary_key
    })
  }

  create(...values: any[]) {
    return insert({
      tableName: this.tableName,
      columns: this.columns,
      value: values
    })
  }

  updateAllById({ values, id }: UpdateAllByIdType) {
    return updateAllById({
      tableName: this.tableName,
      columns: this.columns,
      values: values,
      id: id,
      key: this.primary_key
    })
  }

  deleteOneById(id: number) {
    return deleteOneId({
      tableName: this.tableName,
      id: id,
      key: this.primary_key
    })
  }
}

export default Model
