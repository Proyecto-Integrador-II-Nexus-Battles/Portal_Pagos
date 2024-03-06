export class getDataController {

    static async SEND_PRODUCT(req, res) {
        const { IdUsuario, IdCard, Price, Cantidad, Divisa } = req.body;
        const nuevoProducto = { IdUsuario, IdCard, Price, Cantidad, Divisa };
        const existencia = productos.some(producto => producto.IdCard === nuevoProducto.IdCard);

        if(productos.length > 0){
            if(productos[0].Divisa !== nuevoProducto.Divisa){
                return res.status(400).json({ error: 'No se pueden agregar productos con diferentes divisas.' });
            }else{
                if(existencia){
                    if(nuevoProducto.Cantidad > 0){
                        const index = productos.findIndex(producto => producto.IdCard === nuevoProducto.IdCard);
                        productos[index].Cantidad = nuevoProducto.Cantidad;
                    }else{
                        const nuevosProductos = productos.filter(producto => producto.IdCard !== nuevoProducto.IdCard);
                        productos = nuevosProductos;
                    }
                }else{
                    productos.push(nuevoProducto);
                }
            }
        }else{
            productos.push(nuevoProducto);
        }
        
        const total = productos.reduce((acc, producto) => acc + parseFloat(producto.Price) * parseFloat(producto.Cantidad), 0);
        res.json({ total, productos });
    }

    static async LIST_PRODUCT(req, res) {
        res.json({ productos });
    }

    static async TOTALES(req, res){
        let usuario = productos[0].IdUsuario;
        let divisa = productos[0].Divisa;
        let impuestos = 0.19;
        const tasaCambioUSD = 3800;
        const tasaCambioEUR = 4000;
        let total_neto = productos.reduce((acc, producto) => acc + parseFloat(producto.Price) * parseFloat(producto.Cantidad), 0);
        let total_bruto = 0;
        
        if(divisa === 'USD'){

            total_neto = total_neto * tasaCambioUSD;
            total_bruto = total_neto - (total_neto*impuestos);

            total_neto = total_neto * 0.000256;
            total_bruto = total_bruto * 0.000256;


        }else if(divisa === 'COP'){

            total_bruto = total_neto - (total_neto*impuestos);

            total_neto = total_neto * 0.000256;
            total_bruto = total_bruto * 0.000256;
            divisa = 'USD';

        }else if(divisa === 'EUR'){

            total_neto = total_neto * tasaCambioEUR;
            total_bruto = total_neto - (total_neto*impuestos);

            total_neto = total_neto * 0.00023;
            total_bruto = total_bruto * 0.00023;
        }
        
        total_neto = Math.round(total_neto);
        total_bruto = Math.round(total_bruto);

        return { 
            totales:{
                IdUsuario: usuario,
                Divisa : divisa,
                Total_Neto : total_neto,
                Impuestos : impuestos,
                Total_Bruto: total_bruto,
            },
            productos: productos,
        };
    }

    static async DELETE_PRODUCT(req, res) {
        try {
            const { IdCard } = req.body;
    
            const nuevosProductos = productos.filter(producto => producto.IdCard !== IdCard);
            
            productos = nuevosProductos;
    
            res.json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }

}

let productos = [];