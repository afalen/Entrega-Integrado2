const express = require('express')

const router = express.Router()

const usuario = require('../models/user.model')

const passport = require('passport')


router.get("/login", async (req, res) => {
    res.render("login")
})

router.get("/register", async (req, res) => {
    res.render("register")
})

router.post('/register', passport.authenticate('register',{failureRedirect: '/api/sessions/failregister'})  , async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;


    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).send('Faltan datos.');
    }

    res.redirect('/api/sessions/login');
});

router.get("/failregister", async (req, res) => {
    console.log("Falla en autenticacion del register")
    res.send("Error. Ya hay un usuario registrado con esos datos")
})


router.post("/login", passport.authenticate('login',{failureRedirect:'/api/sessions/faillogin'}) , async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).render("login", { error: "Valores erroneos" });

    const user = await usuario.findOne({ email }, { first_name: 1, last_name: 1, age: 1, password: 1, email: 1, cart: 1, role: 1});
    //console.log(user)

    if (!user) {
        if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
            req.session.user = {
                email: email,
                role: "admin"
            }
            res.redirect("/profile");
        }else{
            return res.status(400).render("login", { error: "Usuario no encontrado" });
        }
    }else{
        
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            cart: user.cart,
            role: user.role
        };
    
        //console.log(req.session)
        res.redirect("/profile"); 
    }
});

router.get('/faillogin', (req,res)=>{
    console.log("Falla en autenticacion del login")
    res.send("No estás registrado o ingresaste un password incorrecto")
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req,res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res)=>{
    req.session.user = {role: "user", ...req.user._doc}
    console.log(req.session.user)
    res.redirect('/profile')
} )


router.get('/current', (req, res)=>{
    //console.log(req.session)
    if (!req.session.user) {
        return res.json({status:"error", error:"no está logueado"})
    }
    
    const { first_name, last_name, email, age, role, cart } = req.session.user

    const result = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        age: age,
        role: role,
        cart: cart,
    }

    //console.log(result)
    res.json({status:"está logueado!", payload: result})
})

module.exports = router