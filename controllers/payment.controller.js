import {
  HOST,
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} from "../config.js";
import axios from "axios";


export const createOrder = async (req, res) => {
  console.log(req)
  const total = req.body.total;
  console.log(total);
  
  //crear el archivo de la orden
  const order = {
    intent: "CAPTURE",
    //productos
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: total,
        },
      },
    ],
    //contexto de la aplicacion
    application_context: {
      brand_name: "THE NEXUS BATTLE II",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: `${HOST}/capture-order`,
      cancel_url: `${HOST}/cancel-order`,
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



export const captureOrder = async (req, res) => {
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
    );

    // Extraer información relevante del objeto response.data
    const { id, status, payer, purchase_units } = response.data;

    // Renderizar la vista con la información
    res.render('pagado', {
      orderId: id,
      status: status,
      payerName: `${payer.name.given_name} ${payer.name.surname}`,
      payerEmail: payer.email_address,
      purchaseUnits: purchase_units,
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error al capturar el pedido:', error);
    res.status(500).send('Error interno del servidor');
  }

};




export const cancelPayment = (req, res) => res.redirect("/");
  