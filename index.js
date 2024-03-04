import express from "express";
import paymentRoutes from "./routes/payment.routes.js";
import crudRoutes from "./routes/crud.routes.js";
import getData from "./routes/getdata.routes.js"
import { PORT } from "./config.js";
import path from "path";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(paymentRoutes);
app.use(crudRoutes);
app.use(getData);

app.use(express.static(path.resolve("public")));
app.set("views", path.resolve("views"));
app.set("view engine", "ejs");

app.listen(PORT);
console.log("Server on port", PORT);
