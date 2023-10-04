const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart: {type: mongoose.Schema.Types.ObjectId, ref:"carts"},
    role: {type: String, default: "user"}
})

userSchema.pre('find', function(){
    this.populate("cart")
})

const usuario = mongoose.model("users", userSchema)

module.exports = usuario