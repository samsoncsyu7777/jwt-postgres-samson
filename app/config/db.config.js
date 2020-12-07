/*
export const HOST = "localhost";
export const USER = "postgres";
export const PASSWORD = "postgres";
export const DB = "testdb";
export const dialect = "postgres";
export const pool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
};
*/

module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "postgres",
  DB: "testdb",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
