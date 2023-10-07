const addToCart = async (productId) =>{
    try{
        const result = await fetch('http://localhost:8080/api/sessions/current', {
            method: "GET",
        }) 
        const user = await result.json()

        const cartId = user?.payload.cart

        if(cartId){
            const resp = await fetch(`http://localhost:8080/api/carts/${cartId}/product/${productId}`, {
                method: "POST",
            })
            if(resp) console.log("Se agregó el producto al carrito del usuario")
        }

    } catch(error){
        console.log(error)
    }
}

const prueba = () =>{
    console.log("sirve todavia")
}