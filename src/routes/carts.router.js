const {Router} = require('express')
const cartModel = require('../models/carts.model')

const router = Router()

// Ruta para agregar un nuevo carrito
router.post('/api/carts', async(req, res) => {
    let resultado = await cartModel.create({})
    res.send({result: 'success', payload: resultado})
});

// Ruta para mostrar los productos de un carrito especificado por su ID
router.get('/api/carts/:cid', async(req, res) => {
    const cid = req.params.cid;
    try{
        let cart = await cartModel.findById(cid)
        console.log(cart)
        res.send({result: 'success', payload: cart})
    }catch(error){
        console.error(error)
    }
});

// Ruta para agregar productos a un carrito especificado
router.post('/api/carts/:cid/product/:pid', async(req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try{
        let cart = await cartModel.findById({_id: cid})
        let product = cart.products  // array de productos en el carrito especificado
        let productInsert = product.find( (product)=>product.product == pid)
        if(productInsert){ // si el producto ya se encuentra en el carrito, aumenta en una unidad
            productInsert.quantity += 1;
        }else{
            cart.products.push({product: pid})
        }
        let resultado = await cartModel.updateOne({_id: cid}, cart)   
        
        res.send({result: 'success', payload: resultado}) 
    }catch(error){
        console.error(error)
    }
});


// Ruta para eliminar un determinado producto de un carrito
router.delete('/api/carts/:cid/products/:pid', async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    try{
        let cart = await cartModel.findById({_id: cid})
        let product = cart.products
        let productsNew = product.filter( (prod)=> prod.product != pid) // array filtrado
        
        let resultado = await cartModel.updateOne({_id: cid}, {$set: {products: productsNew}}) 
        res.send({result: 'success', payload: resultado}) 
    }catch(error){
        console.error(error)
    }

})


router.put('/api/carts/:cid', async(req, res)=>{
    const cid = req.params.cid
    try{
        let cart = await cartModel.findById({_id: cid})
        let productsToReplace = req.body
        let resultado = await cartModel.updateOne({_id: cid}, {$set: {products: productsToReplace}}) 
        res.send({result: 'success', payload: resultado}) 
    }catch(error){
        console.error(error)
    }
})


// Ruta para modificar los ejemplares de un producto determinado en un carrito
router.put('/api/carts/:cid/products/:pid', async(req, res)=>{
    const cid = req.params.cid
    const pid = req.params.pid
    try{
        let cart = await cartModel.findById({_id: cid})
        let product = cart.products
        let productToReplace = req.body
        let newProduct = product.findIndex( (prod) => prod.product == pid)
        product[newProduct].quantity = productToReplace.quantity

        let resultado = await cartModel.updateOne({_id: cid}, cart)   
        res.send({result: 'success', payload: resultado}) 
    }catch(error){
        console.error(error)
    }

})

// Ruta para eliminar todos los productos del carrito especificado
router.delete('/api/carts/:cid', async(req, res)=>{
    const cid = req.params.cid
    try{
        let cart = await cartModel.findById({_id: cid})
        let product = cart.products
        product.splice(0, product.length) 
        let resultado = await cartModel.updateOne({_id: cid}, cart)   
        res.send({result: 'success', payload: resultado}) 
    }catch(error){
        console.error(error)
    }

})

module.exports = router;