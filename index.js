import express from "express";
import paymentRoutes from "./routes/payment.routes.js";
import { PORT } from "./config.js";
import path from "path";
import cors from 'cors'
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/carro_compras', paymentRoutes);

app.use(express.static(path.resolve("public")));
app.set("views", path.resolve("views"));
app.set("view engine", "ejs");

app.listen(PORT);
console.log("Server on port", PORT);

app.post('/asdsad', (req, res) => {
    const listaPreciosSimulados = [
      { carta_id: 92, precio: 5.99, divisa: 'USD' },
];
  
    res.json(listaPreciosSimulados);
  });