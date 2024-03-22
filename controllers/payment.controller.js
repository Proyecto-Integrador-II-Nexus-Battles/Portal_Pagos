import {
  HOST,
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from "../config.js"
import axios from "axios";
import { transaccionModel } from "../models/crud.js";

export class paymentController {

  static async createOrder(req, res) {

    // const { IdUsuario } = req.body;
    //falta que los de registro de usuario manden el id de usuario logeado, asi que uso uno de prueba, nada mas seria cambiar esa linea
    const IdUsuario = 1;

    const respon = await axios.post('http://localhost:4000/carro_compras/PRICE-CARD', {IdUsuario} );
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
    const paypalUrl = response.data.links[1].href;
    res.json({ paypalUrl });
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

      //falta que los de registro de usuario manden el id de usuario logeado, asi que uso uno de prueba, nada mas seria cambiar esa linea
      const IdUsuario = 1; 

      let infoVenta = await axios.post('http://localhost:4000/carro_compras/PRICE-CARD', { IdUsuario });
      const products = await axios.post('http://localhost:4000/carro_compras/LIST_CARD', { IdUsuario });
      console.log('Respuesta de la API de precios:', infoVenta.data);

      const totalNeto = infoVenta.data.totalNeto;
      const divisa = infoVenta.data.divisa;
      const usuario = infoVenta.data.IdUsuario;
      const product = infoVenta.data.list;
      const METODO_PAGO = 'PAY-PAL';

      console.log(product);
      
      
      if (status === 'COMPLETED') {
        await transaccionModel.INSERT(usuario, totalNeto, divisa, METODO_PAGO, product);
        const mibanco = await axios.post('http://localhost:4000/inventario/add-cards', { products }); 
        res.status(200).json({ message: 'Orden pagada correctamente', mibanco});
      }
      
    } catch (error) {
      console.error('Error al capturar el pedido:', error);
      res.status(500).send('Error interno del servidor');
    }
  };

  static async cancelPayment(req, res) {
    res.json("venta cancelada");
  };

  static async boughtCards(req, res){
    const { IdUsuario } = req.body;
    console.log(IdUsuario);
    try{
      const cards = await transaccionModel.GETCARD(1);
      res.json(cards);
    }catch(error){
      console.error(error);
      res.status(500).json({ error: 'Error al buscar cartas' });
    }
  }

}
