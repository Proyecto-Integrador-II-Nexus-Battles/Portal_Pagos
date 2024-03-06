import {
  HOST,
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from "../config.js"
import { getDataController } from "../controllers/getdata.controllers.js"
import axios from "axios";
import { carritoModel } from "../models/crud.js";

export class paymentController {

  static async createOrder(req, res) {
    const { totales } = await getDataController.TOTALES(req, res);
    let total = JSON.stringify(totales.Total_Neto);

    //crear el archivo de la orden
    const order = {
      intent: "CAPTURE",
      //productos
      purchase_units: [
        {
          amount: {
            currency_code: totales.Divisa,
            value: total,
          },
        },
      ],
      //contexto de la aplicacion
      application_context: {
        brand_name: "THE NEXUS BATTLE II",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/carro_compras/capture-order`,
        cancel_url: `${HOST}/carro_compras/cancel-order`,
      },
    };

    const params = new URLSearchParams(); //parametro
    params.append("grant_type", "client_credentials");

    //autenticar antes de mandar la orden y mandar un parametro
    const {
      data: { access_token },
    } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
      auth: {
        username: PAYPAL_API_CLIENT,
        password: PAYPAL_API_SECRET,
      },
    });

    //enviar la orden y recibir permiso
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log(response.data);
    return res.json(response.data);
  };

  static async captureOrder(req, res) {
    const { token } = req.query; //guardo el valor de token que sirve para enviarle a paypal que el usuario acepto

    try {
      const response = await axios.post(
        `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
        {},
        {
          auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET,
          },
        }
      )

      // Extraer información relevante del objeto response.data
      const { id, status, payer, purchase_units } = response.data;

      const {totales, productos} = await getDataController.TOTALES(req, res);
      const ID_USUARIO = Number(totales.IdUsuario);
      const TOTAL_BRUTO = totales.Total_Bruto;
      const METODO_PAGO = 'PAY-PAL';
      const TOTAL_NETO = totales.Total_Neto;
      const DIVISA_PAGADA = totales.Divisa;

      console.log(response.data);

      if (status === 'COMPLETED') {
        await carritoModel.INSERT(ID_USUARIO, TOTAL_BRUTO, DIVISA_PAGADA, METODO_PAGO, TOTAL_NETO, productos);
        res.status(200).json({ message: 'Orden insertada correctamente' });
      } else {
        res.json({
          orderId: id,
          status: status,
          payerName: `${payer.name.given_name} ${payer.name.surname}`,
          payerEmail: payer.email_address,
          purchaseUnits: purchase_units,
        });
      }
    } catch (error) {
      console.error('Error al capturar el pedido:', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  static async cancelPayment(req, res) {
    res.json("venta cancelada");
  }
}
