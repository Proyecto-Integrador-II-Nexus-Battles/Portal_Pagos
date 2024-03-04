import {Router} from 'express' //Modulo especial que se llama router
import { 
    cancelPayment, 
    captureOrder, 
    createOrder
} from "../controllers/payment.controller.js"

const router = Router() //objetos para peticiones (post, put, delete, get)

router.post('/create-order', createOrder);

router.get('/capture-order', captureOrder);

router.get('/cancel-order', cancelPayment);

  
export default router;