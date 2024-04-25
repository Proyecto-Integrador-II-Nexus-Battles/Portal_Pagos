import mariadb from "mariadb";
import { config } from "dotenv";
import { PORT_DB, HOST_DB, PASSWORD_DB, DATABASE, USER_DB } from "../config.js";

config();

export const pool = mariadb.createPool({
  host: HOST_DB,
  user: USER_DB,
  password: PASSWORD_DB,
  database: DATABASE,
  port: PORT_DB,
});

export default pool;
