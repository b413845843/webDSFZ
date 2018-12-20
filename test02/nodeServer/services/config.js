module.exports = {
  database: 'dascom',
  username: 'root',
  password: 'a741741',
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}