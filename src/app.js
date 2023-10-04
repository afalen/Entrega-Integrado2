const express = require('express');
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const path = require('path')
const viewsRouter = require('./routes/views.router')
const handlebars = require('express-handlebars')

const passport = require('passport')
const initializePassport = require('./config/passport.config')


const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const sessionRouter = require('./routes/sessions.router')
const app = express();
const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use(express.static(path.join(__dirname, "/public")))


const enviroment = async()=>{
    await mongoose.connect('mongodb+srv://ecommerceArmandof:falen159@cluster0.yopbtr6.mongodb.net/?retryWrites=true&w=majority')

    console.log("Conectado a la base de datos")
}

enviroment()

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://ecommerceArmandof:falen159@cluster0.yopbtr6.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 1000
    }),
    secret: "claveSecreta",
    resave: false,
    saveUninitialized: true
}))


initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/', productsRouter)
app.use('/', cartsRouter)
app.use('/api/sessions', sessionRouter)
app.use('/', viewsRouter)