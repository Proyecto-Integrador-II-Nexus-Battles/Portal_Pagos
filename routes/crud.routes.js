import {Router} from 'express' //Modulo especial que se llama router
import {
    templateController
} from "../controllers/db.controller.js"

const router = Router() //objetos para peticiones (post, put, delete, get)

router.get('/DETALLES_ORDEN', templateController.DETALLES_ORDEN);

  
export default router;