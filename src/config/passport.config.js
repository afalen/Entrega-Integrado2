const passport = require('passport')
const local = require('passport-local')
const userService = require('../models/user.model')
const cartService = require('../models/carts.model')
const { createHash, isValidatePassword } = require('../../utils')
const GitHubStrategy = require('passport-github2')
require('dotenv').config()

const LocalStrategy = local.Strategy

const initializePassport = () =>{

    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField:'email'},async(req,username,password,done)=>{
            const { first_name,last_name,email,age} = req.body
            try{
                let user = await userService.findOne({email:username})
                if(user){
                    console.log("El usuario ya existe")
                    return done(null,false)
                }
                let cartNew = await cartService.create({})
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    cart: cartNew._id
                }
                let result = await userService.create(newUser)
                return done(null,result)
            }catch(error){
                return done("Error al obtener usuario "+ error)
            }
        }))

        passport.use('login', new LocalStrategy({usernameField: 'email'}, async(username, password, done)=>{
            try{
                if(username === "adminCoder@coder.com" && password === "adminCod3r123"){
                    const adminUser = { _id: 'admin', role: 'admin' };
                    return done(null, adminUser);
                }
                
                const user = await userService.findOne({email:username})
                if(!user){
                    console.log("Usuario no encontrado")
                    return done(null, false)
                }
                if(!isValidatePassword(user, password)) return done(null,false)
                return done(null, user)
            }catch(error){
                return done(error)
            }
        }))


        passport.use('github', new GitHubStrategy({
            clientID: process.env.ID_CLIENT,
            clientSecret: process.env.KEY_SECRET_CLIENT,
            callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        }, async (accessToken, refreshToken, profile, done)=>{
            try{
                let user = await userService.findOne({email: profile._json.email})
                if(!user){
                    let cartNew = await cartService.create({})
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: 18,
                        email: profile._json.email,
                        password: '',
                        cart: cartNew._id,
                    }
        
                    let result = await userService.create(newUser)
                    done(null, result)
                }else{
                    done(null, user)
                }
            }catch(error){
                return done(error)
            }
        }))


        passport.serializeUser((user, done)=>{
            if(user._id === 'admin'){
                done(null, user._id)
            }else{
                done(null, user._id)
            }
        })
    
        passport.deserializeUser(async (id, done)=>{
            if(id === 'admin'){
                const adminUser = { _id: 'admin', role: 'admin' };
                done(null, adminUser)
            }else{
                let user = await userService.findById(id)
                done(null, user)
            }
        })


} 




module.exports = initializePassport