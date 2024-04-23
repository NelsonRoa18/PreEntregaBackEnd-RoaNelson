const express = require("express")
const router = express.Router()
const fs = require("fs").promises

const file = "productos.json"


router.get("/products", async (req, res) => {
    try {

        const limit = parseInt(req.query.limit)

        const data = await fs.readFile(file, "utf-8")

        const products = JSON.parse(data)

        if (!isNaN(limit) && (limit > 0)) {
            const productsLimited = products.splice(0, limit)
            return res.json(productsLimited)
        } else {
            return res.json(products)
        }


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Hubo un error al agregar el producto" });
    }

})

router.get("/products/:id", async (req, res) => {
    try {

        const idParam = parseInt(req.params.id)
        const data = await fs.readFile(file, "utf-8")
        const products = JSON.parse(data)

        const finderProduct = products.find((p) => p.id === idParam)

        return res.json(finderProduct)

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Hubo un error al agregar el producto" });
    }




})
router.post("/products", async (req, res) => {
    try {

        const data = await fs.readFile(file, "utf-8")
        const products = JSON.parse(data)

        const { title, description, code, price, stock, category, thumbnails } = req.body;
        const id = products.length + 1;
        const status = true;
        const newProduct = { id, title, description, code, price, status, stock, category, thumbnails }

        products.push(newProduct)

        await fs.writeFile(file, JSON.stringify(products, null, 2))

        res.json({ message: "Producto agregado" })
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Hubo un error al agregar el producto" });
    }

})

router.put("/products/:id", async (req, res) => {
    try {
        
        const data = await fs.readFile(file, "utf-8")
        const products = JSON.parse(data)

        const {title, description, code, price, stock, category, thumbnails} = req.body
        const idProductToUpdate = parseInt(req.params.id)

        const finderProduct = products.find((p) => p.id === idProductToUpdate)

        if (!finderProduct) {
            res.json ( {message : "Error producto no encontrado"} )
        }
        finderProduct.title = title
        finderProduct.description = description
        finderProduct.code = code
        finderProduct.price = price
        finderProduct.category = category
        finderProduct.thumbnails = thumbnails

        await fs.writeFile(file, JSON.stringify(products, null, 2))
        res.json({message : "Producto modificado correctamente"})


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Hubo un error al agregar el producto" });
    }
})

router.delete("/products/:id", async(req, res) => {
    try {
        const idProductToDelete = parseInt(req.params.id)
        const data = await fs.readFile(file, "utf-8")
        const products = JSON.parse(data)

        const productToDelete = products.find((p) => p.id === idProductToDelete)

        if (!productToDelete) {
            res.json({message : "No existe un producto con ese id"})
        }

        const newListProducts = products.filter((p) => p.id !== idProductToDelete)
        

        await fs.writeFile(file, JSON.stringify(newListProducts,null, 2))

        res.json({message : "Producto eliminado correctamente"})

    } catch (error) {
        
    }
})


module.exports = router
