import { config } from "dotenv";
config();

export const APP_PORT = process.env.APP_PORT || 3000;
export const PORT = process.env.PORT;
export const HOST = process.env.HOST;

export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT || ""; //agarro la clave cliente del .env
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET || ""; //agarro la clave secreta del .env
export const PAYPAL_API = "https://api-m.sandbox.paypal.com";

export const HOST_DB = process.env.HOST_DB;
export const PORT_DB = process.env.PORT_DB;
export const USER_DB = process.env.USER_DB;
export const DATABASE = process.env.DATABASE;
export const PASSWORD_DB = process.env.PASSWORD_DB;
