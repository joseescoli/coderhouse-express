(
    async () => {
        // Se busca el "button" que lleve el "id" con nombre "checkout" y lo almacena en la constante "checkout". Este es el botón que finaliza la compra.
        const checkout = document.querySelector("#checkout")
        // Se almacena el valor del atributo dataset "data-cart" del botón "checkout" de arriba. Este es el ID de carrito que proviene del usuario.
        const cart = checkout.dataset.cart

        // Se desencadena evento para finalizar la compra
        checkout.addEventListener("click", async () => {
            try {
                const response = await fetch(
                    `/api/carts/${cart}/purchase`,
                    {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    }
                );

                const purchase = await response.json();
                // Muestra mensaje cuando se compra el carrito correctamente
                if ( response.status === 200 && purchase ) {
                    alert(purchase.data)
                    location.reload()
                }
                else
                    alert("Invalid operation! Cart empty!")
                    
            } catch (error) {
                // Mostrar error en caso de encontrarse
                console.log(error);
                alert(`Error: ${error}`)
            }
        } )
        // Se busca el "button" que lleve la "class" con nombre "cartAdd" y lo almacena en la constante "addProdtoCart"
        const addProdtoCart = document.querySelectorAll(".cartAdd");

        // Desencadena el evento para el botón arriba definido
        addProdtoCart.forEach( (button) => {
            button.addEventListener("click", async (event) => {                
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
                    if ( response.status === 200 && addProdCart )
                        alert(`Product ${pid} added to cart ID ${cart}!`)
                    else if ( response.status === 400 && addProdCart )
                        alert('ERROR:\nMessage: ' + addProdCart.message + '\nError: ' + addProdCart.error)
                    else
                        alert("Invalid operation! Check user role.")
                } catch (error) {
                    // Mostrar error en caso de encontrarse
                        alert(`Error: ${error}`)
                }
            })
        })
    }
) ();