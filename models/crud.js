import { json } from 'express';
import pool from '../models/dbconection.js';

export class carritoModel {

    static async INSERT(ID_USUARIO, TOTAL_BRUTO, DIVISA_PAGADA, METODO_PAGO, TOTAL_NETO, productos ) {
        try {
            const insertQuery = `
              INSERT INTO DETALLES_ORDEN 
              (ID_USUARIO, TOTAL_BRUTO, FECHA_PAGO, DIVISA_PAGADA, METODO_PAGO, TOTAL_NETO, IMPUESTOS) 
              VALUES 
              (?, ?, NOW(), ?, ?, ?, 19.0);
            `;
        
            // Ejecutar la consulta en la base de datos
            const result = await pool.query(insertQuery, [Number(ID_USUARIO), parseFloat(TOTAL_BRUTO), DIVISA_PAGADA, METODO_PAGO, parseFloat(TOTAL_NETO)]);
            const detallesOrdenID = result.insertId;

            for (const carta of productos) {
                const resultCartas = await pool.query(
                    `INSERT INTO ITEM_CARTAS (CARTAS_ID, CANTIDAD, DETALLES_ORDEN_ID) VALUES (?, ?, ?)`,
                    [carta.IdCard, carta.Cantidad, detallesOrdenID]
                );
            }

            // Devolver el resultado
            return result;
          } catch (error) {
            console.error('Error al insertar la orden:', error);
            throw error;
          }
    }



}