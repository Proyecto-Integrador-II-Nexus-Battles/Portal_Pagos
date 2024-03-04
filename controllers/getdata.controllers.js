export class getDataController {

    static async SEND_PRODUCT(req, res) {
        const { IdUsuario, IdCard, Price, Divisa } = req.body;

        const nuevoProducto = { IdUsuario, IdCard, Price, Divisa };
        productos.push(nuevoProducto);
        const total = productos.reduce((acc, producto) => acc + parseFloat(producto.Price), 0);
        res.json({ total, productos });
    }

    static async LIST_PRODUCT(req, res) {
        const total = productos.reduce((acc, producto) => acc + parseFloat(producto.Price), 0);
        res.json({ total, productos });
    }

    static async DELETE_PRODUCT(req, res) {
        const { IdCard } = req.body;

        const indexToRemove = productos.findIndex(producto => producto.IdCard === IdCard);

        if (indexToRemove !== -1) {
            productos.splice(indexToRemove, 1);
            res.json({ message: 'Producto eliminado correctamente.' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado.' });
        }
    }



}

const productos = [];