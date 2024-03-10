import {Router} from 'express' //Modulo especial que se llama router
import { 
    paymentController
} from "../controllers/payment.controller.js"
import { carritoModel } from "../models/crud.js"

const router = Router() //objetos para peticiones (post, put, delete, get)

router.post('/create-order', paymentController.createOrder);

router.get('/capture-order', paymentController.captureOrder);

router.get('/cancel-order', paymentController.cancelPayment);

router.post('/INSERT', carritoModel.INSERT);

export default router;