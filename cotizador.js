document.getElementById('mesasCuatro').style.display = 'none'
document.getElementById('botonMesasCuatro').style.display = 'none'
document.getElementById('mesasOcho').style.display = 'none'
document.getElementById('botonMesasOcho').style.display = 'none'
document.getElementById('wspButton').style.display = 'none'
document.getElementById('resetButton').style.display = 'none'
sessionStorage.clear();

const cotizador = (personas) => {
    let objetoInformacion
    switch(true) {
        case personas >= 10 && personas <= 40:
            objetoInformacion = {paquete: 'Paquete 1', cantidadMin: 10, cantidadMax: 40, personas: 'entre 10 y 40 personas', precioPersona: 0, precioTotal: 200, cantidad: personas}
            break
        
        case personas > 40 && personas <= 80:
            objetoInformacion = {paquete: 'Paquete 2', cantidadMin: 41, cantidadMax: 80, personas: 'entre 41 y 80 personas', precioPersona: 5, precioTotal: personas * 5, cantidad: personas}
            break

        case personas > 80 && personas <= 150:
            objetoInformacion = {paquete: 'Paquete 3', cantidadMin: 81, cantidadMax: 150, personas: 'entre 81 y 150 personas', precioPersona: 4.5, precioTotal: personas * 4.5, cantidad: personas}
            break
        
        case personas > 150 && personas <= 220:
            objetoInformacion = {paquete: 'Paquete 4', cantidadMin: 151, cantidadMax: 220, personas: 'entre 151 y 220 personas', precioPersona: 4, precioTotal: personas * 4, cantidad: personas}
            break

        default:
            objetoInformacion = false
    }
    return objetoInformacion
}

const sumarMesas = (mesas, tipo) => {
    let objetoMesas
    if (tipo == 4) {
        if (mesas >= 1 && mesas <= 50) {
            let mesasSession = recuperarMesas()
            if (mesasSession[0]) {
                objetoMesas = mesasSession[0]
                objetoMesas = {...objetoMesas, cantidad: mesas, precio: mesas * 6}
            } else {
                objetoMesas = {mesa: 'mesa/s de 4', cantidad: mesas, capacidad: mesas * 4, precio: mesas * 6}
            }
            guardarMesas(objetoMesas, 4)
            mostrarTotal(sacarTotal())
        } else {
            objetoMesas = false
        }
    } else {
        if (mesas >= 1 && mesas <= 25) {
            let mesasSession = recuperarMesas()
            if (mesasSession[1]) {
                objetoMesas = mesasSession[1]
                objetoMesas = {...objetoMesas, cantidad: mesas, precio: mesas * 30}
            } else {
                objetoMesas = {mesa: 'mesa/s de 8', cantidad: mesas, capacidad: mesas * 8, precio: mesas * 30}
            }
            guardarMesas(objetoMesas, 8)
            mostrarTotal(sacarTotal())
        } else {
            objetoMesas = false
        }
    }
    return objetoMesas
}

const sacarTotal = () => {
    let total = recuperarTotal()
    let mesasSession = recuperarMesas()
    if (mesasSession[0] || mesasSession[1]) {
        total = recuperarDatos().precioTotal + (mesasSession[0].precio || 0) + (mesasSession[1].precio || 0)
    } else {
        total = recuperarDatos().precioTotal
    }
    guardarTotal(total)
    return total
}

const mostrarInformacion = (informacion) => {
    let informacionCotizador = document.getElementById('informacion')
    informacionCotizador.innerHTML = ''
    let div = document.createElement('div')
    div.className = 'cardCotizador'
    div.innerHTML = `
                        <h2>${informacion.paquete}</h2>
                        <h3>Cantidad ${informacion.personas}</h3>
                        <h3>Precio de $${informacion.precioTotal} ${informacion.precioPersona > 0 ? ', a $' + informacion.precioPersona + ' por persona' : ''}</h3>
                        <h4>Incluye:</h4>
                        <ul>
                            <li>5 horas de uso</li>
                            <li>Vigilancia no armada</li>
                            <li>4 guias de luces italianas (vintage)</li>
                        </ul>
                    `
    informacionCotizador.appendChild(div)
    document.getElementById('wspButton').style.display = 'block'
    document.getElementById('wspButton').onclick = mensajeWsp
    document.getElementById('mesasCuatro').style.display = 'block'
    document.getElementById('botonMesasCuatro').style.display = 'block'
    document.getElementById('mesasOcho').style.display = 'block'
    document.getElementById('botonMesasOcho').style.display = 'block'
    document.getElementById('resetButton').style.display = 'block'
}

const mostrarCotizado = (informacion) => {
    let mensaje = document.getElementById('mensaje')
    if (informacion) {
        mensaje.innerText = ''
        mostrarInformacion(informacion)
        guardar(informacion)
    } else {
        mensaje.innerText = 'Cantidad de personas inválida'
        mensaje.style.color = 'red'
    }
    mostrarTotal(sacarTotal())
}

const mostrarTotal = (total) => {
    let mostrarTotal = document.getElementById('total')
    mostrarTotal.innerHTML = 'Total de $' + total
}

const cotizar = () => {
    let cantidadIngresada = document.getElementById('personas').value
    mostrarCotizado(cotizador(cantidadIngresada))
}

const mensajeWsp = () => {
    let num = '+50379368420'
    let datos = recuperarDatos()
    let total = recuperarTotal()
    let mesas = recuperarMesas() || 'sin mesas'
    let msg =   `%0A¡Hola! Mi consulta web es:
                %0A ====================
                %0A - ${datos.cantidad} personas (${datos.paquete}, ${datos.personas}, precio de $${datos.precioTotal})
                %0A - Mesas: ${mesas[0].cantidad || 0} ${mesas[0].mesa || 'mesa/s de 4'}, ${mesas[1].cantidad || 0} ${mesas[1].mesa || 'mesa/s de 8'}
                %0A ====================
                %0A *TOTAL: $${total}*`
    let win = window.open(`https://api.whatsapp.com/send?phone=${num}&text=${msg}`, '_blank')
    win.focus()
}

const guardar = (datos) => {
    sessionStorage.setItem('datos', JSON.stringify(datos))
}

const guardarMesas = (mesas, tipo) => {
    if (tipo == 4) {
        sessionStorage.setItem('mesasCuatro', JSON.stringify(mesas))
    } else {
        sessionStorage.setItem('mesasOcho', JSON.stringify(mesas))
    }
}

const guardarTotal = (total) => {
    sessionStorage.setItem('total', JSON.stringify(total))
}

const recuperarDatos = () => {
    return JSON.parse(sessionStorage.getItem('datos'))
}

const recuperarMesas = () => {
    let mesas = []
    JSON.parse(sessionStorage.getItem('mesasCuatro')) ? mesas[0] = JSON.parse(sessionStorage.getItem('mesasCuatro')) : mesas[0] = 0
    JSON.parse(sessionStorage.getItem('mesasOcho')) ? mesas[1] = JSON.parse(sessionStorage.getItem('mesasOcho')) : mesas[1] = 0
    return mesas
}

const recuperarTotal = () => {
    return JSON.parse(sessionStorage.getItem('total'))
}

const reiniciar = () => {
    window.location.reload()
}