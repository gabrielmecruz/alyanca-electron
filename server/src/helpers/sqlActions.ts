import db from '../config/db.js'
import util from 'util'

const inqueryPromise = util.promisify(db.execute.bind(db));

async function inquery(query: string) {
  try {
    const IQuery = await inqueryPromise(query);
    return IQuery;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function colonQuery(query: string, params: Array<any>) {
  const getQuery = query
  try {
    const IQuery = await inqueryPromise(getQuery, params);
    return IQuery;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  inquery,
  colonQuery
}