import {Router} from 'express' //Modulo especial que se llama router
import {
    getDataController
} from "../controllers/getdata.controllers.js"

const router = Router() //objetos para peticiones (post, put, delete, get)

router.get('/SEND-PRODUCT', getDataController.SEND_PRODUCT);
router.get('/LIST-PRODUCTS', getDataController.LIST_PRODUCT);
router.get('/DELETE-PRODUCT', getDataController.DELETE_PRODUCT);
router.post('/TOTALES', getDataController.TOTALES);

export default router;