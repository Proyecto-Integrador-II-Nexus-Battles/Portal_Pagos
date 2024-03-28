import { config } from "dotenv";
config();

export const PORT = process.env.PORT;
export const HOST = process.env.HOST + ':' + PORT;

export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT || ""; //agarro la clave cliente del .env
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET || ""; //agarro la clave secreta del .env
export const PAYPAL_API = "https://api-m.sandbox.paypal.com";
