const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const cartColletion = 'carts'

const cartSchema = new mongoose.Schema({
    products:{
        type:[
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products" 
                },
                quantity:{ type: Number, default: 1}
            }

        ],
        default: []
    }
})

cartSchema.pre('find', function(){
    this.populate("products.product")
})

cartSchema.plugin(mongoosePaginate)

const cartModel = mongoose.model(cartColletion, cartSchema)

module.exports = cartModel
