const express = require('express')
const productModel = require('../models/products.model')
const cartModel = require('../models/carts.model')

const router = express.Router()


router.get('/products', async(req, res)=>{
    try {
        const limit = parseInt(req.query.limit) || 10
        const page = parseInt(req.query.page) || 1 
        const options = {
            page: page,
            limit: limit,
            lean: true
        }
        const result = await productModel.paginate({}, options);
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${result.limit}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${result.limit}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages)
        
        res.render('products', result);
    } catch (error) {
        console.error('Error al recuperar productos:', error);
        res.status(500).send('Error al recuperar productos');
    }

})


router.get('/carts/:cid', async(req,res)=>{
    try{
        const cid = req.params.cid;
        let cart = await cartModel.findById(cid).lean(true)
        res.render('carts', cart)
    }catch(error){
        console.error('Error al recuperar el carrito:', error);
        res.status(500).send('Error al recuperar el carrito');
    }
})



// Sessions


router.get("/profile", async (req, res) => {
    try{
        if (!req.session.user) {
            return res.redirect("login")
        }
    
        const { first_name, last_name, email, age, role, cart } = req.session.user

            const result = await productModel.paginate({}, {lean: true});
            result.first_name = first_name,
            result.last_name = last_name,
            result.email = email,
            result.age = age,
            result.role = role,
            result.cart = cart,
            result.isAdmin = role === "admin" 
            
            //console.log(result)
            res.render("profile", result)
        
    }catch(error){
        console.error('Error al recuperar los productos:', error);
        res.status(500).send('Error al recuperar los productos');
    }
})

router.get("/logout", async (req, res) => {
    req.session.destroy(err =>{
        if(!err) res.redirect("/api/sessions/login")
        else res.send({status: 'Logout ERROR', body: err})
    })

})

module.exports = router