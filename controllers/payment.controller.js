import {
  HOST,
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from "../config.js"
import axios from "axios";
import { carritoModel } from "../models/crud.js";

export class paymentController {

  static async createOrder(req, res) {

    const IdUsuario = 1;

    const respon = await axios.post('http://localhost:5000/carro_compras/PRICE-CARD', {IdUsuario} );
    console.log('Respuesta de la API de precios:', respon.data);

    const totalNeto = respon.data.totalNeto;
    const divisa = respon.data.divisa;

    console.log(totalNeto, divisa);
    const order = {
      intent: "CAPTURE",
      //productos
      purchase_units: [
        {
          amount: {
            currency_code: divisa,
            value: totalNeto,
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

      const IdUsuario = 1; 

      let infoVenta = await axios.post('http://localhost:5000/carro_compras/PRICE-CARD', { IdUsuario });
      console.log('Respuesta de la API de precios:', infoVenta.data);

      const totalNeto = infoVenta.data.totalNeto;
      const divisa = infoVenta.data.divisa;
      const usuario = infoVenta.data.IdUsuario;
      const product = infoVenta.data.list;
      const METODO_PAGO = 'PAY-PAL';

      res.json(totalNeto, divisa, usuario, product);

      if (status === 'COMPLETED') {
        await carritoModel.INSERT(usuario, totalNeto, divisa, METODO_PAGO, product);
        res.status(200).json({ message: 'Orden insertada correctamente' });
      }
      
    } catch (error) {
      console.error('Error al capturar el pedido:', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  static async cancelPayment(req, res) {
    res.json("venta cancelada");
  };
}
