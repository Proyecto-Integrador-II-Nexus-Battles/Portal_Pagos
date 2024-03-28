import mariadb from "mariadb";
import { config } from "dotenv";

config();

export const pool = mariadb.createPool({
    host: process.env.HOST_BD,
    user: process.env.USER_BD,
    password: process.env.PASSWORD_BD,
    database: process.env.DATABASE,
    port: process.env.PORT_DB
})

export default pool;