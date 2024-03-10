import { json } from 'express';
import pool from '../models/dbconection.js';

export class carritoModel {

    static async INSERT( usuario, totalNeto, divisa, METODO_PAGO, product ) {
        try {
            const insertQuery = `
              INSERT INTO DETALLES_ORDEN 
              (ID_USUARIO, TOTAL_BRUTO, FECHA_PAGO, DIVISA_PAGADA, METODO_PAGO, TOTAL_NETO, IMPUESTOS) 
              VALUES 
              (?, ?, NOW(), ?, ?, ?, 19.0);
            `;
        
            // Ejecutar la consulta en la base de datos
            const result = await pool.query(insertQuery, [Number(usuario), parseFloat(totalNeto - (totalNeto * 0.19)), divisa, METODO_PAGO, parseFloat(totalNeto), 19]);
            const detallesOrdenID = result.insertId;

            for (const carta of product) {
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