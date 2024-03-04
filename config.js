import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 5000;
export const HOST = "http://localhost:" + PORT;

export const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT || ""; //agarro la clave cliente del .env
export const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET || ""; //agarro la clave secreta del .env
export const PAYPAL_API = "https://api-m.sandbox.paypal.com";
