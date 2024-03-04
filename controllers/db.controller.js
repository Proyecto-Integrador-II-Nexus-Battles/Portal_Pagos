import { templateModel } from "../models/crud.js"


// En esta clase se encarga de controlar los datos y consultas (get-post) y devolverlas en formato JSON
// Hacia la vista que las requiera 
export class templateController { // --> TODOS LOS ARCHIVOS FUNCIONAM COMO UNA CAJA FUERTE
    
    static async DETALLES_ORDEN (req, res) {
        const detalleOrden = await templateModel.DETALLES_ORDEN(req, res); // --> Sabemos que hace el getAll del modelo, PERO NO !!!CÓMO LO HACE!!!, el !CÓMO no nos interesa en este archivo
        res.json(detalleOrden);
    }

    static async getByID (req, res) {

    }

    // Create
    // Upload
    // Delete
}