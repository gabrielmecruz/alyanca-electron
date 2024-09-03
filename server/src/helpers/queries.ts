import { InsertType, UpdateOneType, UpdateAllIdType, DeleteOneType, DeleteOneIdType } from '../interfaces/IQuery.js'
import { inquery, colonQuery } from './sqlActions.js'

function repeatString(str: string, count: any) {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += str;
    if (i < count - 1) {
      result += ',';
    }
  }
  return result;
}

async function findAll(key: string) {
  const result = await inquery(`SELECT * FROM ${key}`)
  return result
}

async function find({ tableName, id, key }: any) {
  const query = `SELECT * FROM ${tableName} WHERE ${key} = ?`
  return await colonQuery(query, [id])
}

async function insert({ tableName, columns, value }: InsertType) {
  const colSplit = columns.split(',')
  const convertCols = []
  for (let col of colSplit) {
    if (col == ' E-Mail1') col = ' `E-Mail1`'
    if (col == ' E-Mail2') col = ' `E-Mail2`'
    convertCols.push(col)
  }
  let valueLen = repeatString('?', colSplit.length)
  const query = `INSERT INTO ${tableName} (${convertCols}) VALUES (${valueLen})`
  return await colonQuery(query, value)
}

async function updateOne({ tableName, targetKey, whereKey, values }: UpdateOneType) {
  const query = `UPDATE ${tableName} SET ${targetKey} = ? WHERE ${whereKey} = ?`
  return await colonQuery(query, values)
}

async function updateAllById({ tableName, columns, values, id, key }: UpdateAllIdType) {
  const cols = columns.split(',')
  const convertCols = []
  if (!columns.length === values.length) {
    return
  }
  for (let col of cols) {
    if (col == ' E-Mail1') col = '`E-Mail1`'
    if (col == ' E-Mail2') col = '`E-Mail2`'
    convertCols.push(`${col} = ?`)
  }
  const colsString = convertCols.toString()

  const query = `UPDATE ${tableName} SET ${colsString} WHERE ${key} = ?`
  return await colonQuery(query, [...values, id])
}

async function deleteOne({ tableName, key, value }: DeleteOneType) {
  const query = `DELETE FROM ${tableName} WHERE ${key} = ?`
  return await colonQuery(query, [value])
}

async function deleteOneId({ tableName, id, key }: DeleteOneIdType) {
  const query = `DELETE FROM ${tableName} WHERE ${key} = ?`
  return await colonQuery(query, [id])
}

export {
  find,
  findAll,
  insert,

  updateOne,
  updateAllById,

  deleteOne,
  deleteOneId
}