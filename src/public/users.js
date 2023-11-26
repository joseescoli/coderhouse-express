(
    async () => {

        // Se buscan los botones por id "userDel" y se almacena en la constante "removeButton". Este almacena los sucesivos botones de cada registro para realizar las operaciones.
        // const removeButton = document.querySelector("#userDel")
        const removeButton = document.querySelectorAll("#userDel")

        // Desencadena el evento para cada botón definido
        removeButton.forEach( (button) => {
            button.addEventListener("click", async (event) => {                
                // Se busca el "id" y lo almacena en la constante "uid". Este es el ID de usuario con el que se realizan operaciones luego.
                const uid = event.target.dataset.id
                // Se eliminar el usuario
                try {
                    const response = await fetch(
                        `/api/users/${uid}`,
                        {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        }
                    );
                    const userDeleted = await response.json();
                    // Muestra mensaje cuando el producto se agrega correctamente
                    if ( response.status === 200 && userDeleted ) {
                        alert(`User ${uid} deleted correctly!`)
                        location.reload()
                    }
                    else
                        alert("Invalid operation! Check user.")
                        

                } catch (error) {
                    // Mostrar error en caso de encontrarse
                        alert(`Error: ${error}`)
                }
            })
        })
    }
) ();