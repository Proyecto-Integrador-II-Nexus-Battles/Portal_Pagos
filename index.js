import express from "express";
import paymentRoutes from "./routes/payment.routes.js";
import { APP_PORT } from "./config.js";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import http from "http";
import https from "https";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/pagos", paymentRoutes);

app.use(express.static(path.resolve("public")));
app.set("views", path.resolve("views"));
app.set("view engine", "ejs");

const options = {
  key: fs.readFileSync("certs/privkey.pem"),
  cert: fs.readFileSync("certs/cert.pem"),
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(APP_PORT);
console.log("Server on port", APP_PORT);
