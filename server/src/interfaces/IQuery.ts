interface InsertManyType {
  tableName: string,
  columns: any[],
  values: any[]
}

interface InsertType {
  tableName: string,
  columns: string | any,
  value: Array<any> | any
}

interface UpdateAllIdType {
  tableName: string,
  columns: string,
  values: any,
  id: number,
  key: string
}

interface UpdateOneType {
  tableName: string,
  targetKey: string,
  whereKey: string,
  values: Array<any> | any
}

interface UpdateOneIdType {
  tableName: string,
  key: string,
  values: string | any,
}

interface DeleteOneType {
  tableName: string,
  key: string,
  value: string | number | any
}

interface DeleteOneIdType {
  tableName: string,
  id: number,
  key: string
}

export {
  InsertType,
  InsertManyType,
  UpdateAllIdType,
  UpdateOneType,
  UpdateOneIdType,
  DeleteOneType,
  DeleteOneIdType
}