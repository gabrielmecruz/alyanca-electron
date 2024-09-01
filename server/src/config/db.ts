import mysql from 'mysql2'

const db = mysql.createConnection({
  host: 'localhost',
  user: 'sqluser', //trocar para o usuario padrão
  password: 'toor', //trocar para a senha padrão
  database: 'alyanca-contabilidade',
  namedPlaceholders: true
})

if (db) {
  console.log('Database connected successfully')
}

export default db;
