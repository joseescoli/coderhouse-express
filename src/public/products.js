(
    async () => {
/*
        // Se obtienen los carritos
        const carts = await fetch("/api/carts");
        let cart = await carts.json()
*/
        let cart = JSON.parse(localStorage.getItem('carrito'))
        // Si no existen carritos se crea uno
        if (!cart) {
            const newCart = await fetch("/api/carts", { method: "POST" });
            //cart = await newCart.json()
            //let cart = await newCart.json()
            cart = ( await newCart.json() ).id
            console.log("!cart:" + cart);
        }
            console.log("cart:" + cart);

            localStorage.setItem('carrito', JSON.stringify(cart))
    
            // Se busca el "button" que lleve la "class" con nombre "cartAdd" y lo almacena en la constante "addProdtoCart"
            const addProdtoCart = document.querySelectorAll(".cartAdd");
        
            // Desencadena el evento para el botón arriba definido
            addProdtoCart.forEach( (button) => {
                button.addEventListener("click", async (event) => {
                    
                    console.log(cart.id)
                    const { id: pid } = event.target.dataset
            
                    // Se agrega el producto al carrito
                    try {
                        const response = await fetch(
                            `/api/carts/${cart}/product/${pid}`,
                            {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            }
                        );
                        const addProdCart = await response.json();
                
                        // Muestra mensaje cuando el producto se agrega correctamente
                        if (addProdCart)
                            alert(`Product ${pid} added to cart ID ${cart}!`)

                    } catch (error) {
                        // Show error en caso de encontrarse
                            alert(`Error: ${error}`)
                    }
                })
            })
    }
) ();