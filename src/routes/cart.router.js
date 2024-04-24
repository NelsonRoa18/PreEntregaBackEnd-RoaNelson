const express = require("express")
const router = express.Router()
const fs = require('fs').promises

const file = './data/carrito.json'

router.get("/carts/:id", async (req, res) => {
    const data = await fs.readFile(file, "utf-8")
    const carts = JSON.parse(data)

    const idToFindCart = parseInt(req.params.id)

    const finderCart = carts.find((c) => c.id === idToFindCart)

    if (!finderCart) {
        res.json({ message: "Carrito no encontrado" })
    }

    res.json(finderCart)

})

router.post("/carts", async (req, res) => {
    try {
        const data = await fs.readFile(file, "utf-8")
        const carts = JSON.parse(data)

        const { products = [] } = req.body
        const id = carts.length + 1

        const newCart = { id, products }

        carts.push(newCart)

        await fs.writeFile(file, JSON.stringify(carts, null, 2))
        res.json({ message: "Carrito agregado" })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Hubo un error al agregar el carrito" });
    }



})

router.post("/carts/:cid/products/:pid", async (req, res) => {

    try {
        const data = await fs.readFile(file, "utf-8")
        const carts = JSON.parse(data)

        const idCart = parseInt(req.params.cid)
        const idProduct = parseInt(req.params.pid)

        const { quantity } = req.body
        const newProductToCart = { idProduct, quantity }
        //Utilizo el metodo findIndex para buscar en que carrito colocar el producto con el "idCart"
        const cartIndex = carts.findIndex((c) => c.id === idCart)

        if (cartIndex === -1) {
            res.json({ message: "Carrito no encontrado" })
        } else {
            const cart = carts[cartIndex]

            const productIndex = cart.products.findIndex((p) => p.idProduct === idProduct)
            if (productIndex === -1) {
                cart.products = [...cart.products, newProductToCart]
                res.json({ message: "Producto agregado con exito" })
            } else {
                cart.products[productIndex].quantity += quantity
                console.log(cart.products[productIndex].quantity);
                res.json({ message: "Producto ya existente, se le modifico la cantidad" })
            }
        }
        await fs.writeFile(file, JSON.stringify(carts, null, 2))

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Hubo un error al agregar el carrito" });
    }


})


module.exports = router