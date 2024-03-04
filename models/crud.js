import pool from '../models/dbconection.js';

export class templateModel {
    
    static async DETALLES_ORDEN(req, res) {
        try {
            console.log('Antes de la consulta a la base de datos');
            const usernames = await pool.query('SELECT * FROM users');
            console.log('Después de la consulta a la base de datos');
            res.json(usernames);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    }

    static async getByID() {
        const templateJSON =  {
            name: 'Juan',
            age: 20
        }
        //Consulta a la base de datos para devolver todos los datos
        return templateJSON
    }

}