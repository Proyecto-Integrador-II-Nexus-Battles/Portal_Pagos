import { Router } from "express"; //Modulo especial que se llama router
import { paymentController } from "../controllers/payment.controller.js";
import { transaccionModel } from "../models/crud.js";

const router = Router(); //objetos para peticiones (post, put, delete, get)

router.post("/create-order", paymentController.createOrder);

router.get("/capture-order", paymentController.captureOrder);

router.get("/cancel-order", paymentController.cancelPayment);

router.post("/bought-Cards", paymentController.boughtCards);

router.post("/INSERT", transaccionModel.INSERT);

router.get("/success", paymentController.renderSuccess);

export default router;
