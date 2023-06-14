let carrito = []; //Arreglo de productos de carrito vacío
let btn_compra = document.querySelectorAll(".btn_compra"); //Seleccionar todo id de botón compra
let btn_checkout = document.getElementById("btn_checkout"); //Seleccionar la clase de botón checkout
btn_checkout.addEventListener("click", check_out_carrito); //Para el único botón check out añadir función check out carrito
window.addEventListener("load", cargar_carrito); //Cuando carga la página, se llama función cargar_carrito

for (let btn of btn_compra){ //Para cada elemento del arreglo botón compra añadir
    btn.addEventListener("click", agregar_carrito); //Evento de click y acer función de agregar a carrito
}

guardado_carrito=()=>{
    let carrito_JSON = JSON.stringify(carrito); //Guardar carrito como JSON
    localStorage.setItem("carrito", carrito_JSON); //Set de items
}

producto_ya_seleccionado=(nombre)=>{ //Función para verificar si ya se ha seleccionado el producto
    return carrito.some(producto => producto.nombre === nombre); //Regresar verdadero si some encontró un nombre idéntico en el arreglo del objetos de producto
}

generar_SKU=()=>{ //Función para generar SKU
    return Math.floor(Math.random() * 900) + 100; //Regresa un número randoim de 3 dígitos
}

mostrar_carrito=()=>{ //Función para modificar el HTML
    let tabla = document.getElementById("tbody"); //Declarar una variable como el id tbody
    tabla.innerHTML = ""; //Reseteo del bucle

    for (let producto of carrito) { //Para cada elemento del arreglo carrito
        if (producto.cantidad === 0) { //Si la cantidad es exactamente igual a 0 entonces
            continue; //Continua
        }

        let fila = document.createElement(`tr`); //Declarar una variable como la creación de una etriqueta tr dentro del HTML
        fila.innerHTML = //Bloque de texto que se va a crear dentro del HTML
                `<td class="mostrar_carrito">
                    <img src="${producto.img}" class="img_add">
                    <p class="producto_nombre">${producto.nombre}</p>
                </td>
                <td> 
                    <div class="contador-container">
                        <button type="button" class="btn btn-secondary btn_cantidad">+</button>
                        <p class="contador">${producto.cantidad}</p>
                        <button type="button" class="btn btn-secondary btn_cantidad">-</button>
                    </div>
                </td>
                <td>
                    <p>$<span class="precio_de_unidades">${producto.precio_unidades}</span></p>
                </td>
                <td>
                    <button class="btn btn-danger btn_borrar">Borrar</button>
                </td>`;

        tabla.append(fila); //Insertar fila creada
    }

    let btn_borrar = document.querySelectorAll(".btn_borrar"); //Seleccionar todos los ids btn_borrar
    for (let btn of btn_borrar) { //Para cada elemento del arreglo de btn_borrar
        btn.addEventListener("click", borrar_carrito); //Añadir evento de click y mandar a llamar función borrar_carrito
    }

    let btn_cantidad = document.querySelectorAll(".btn_cantidad"); //Seleccionar todos los ids btn_cantidad
    for (let btn of btn_cantidad) { //Para cada elemento del arreglo de btn_cantidad
        btn.addEventListener("click", actualizar_cantidad); //Añadir evento de click y mandar a llamar función para actualizar cantidad
    }

    total_tabla(); //Mandar a llamar función total_tabla
}

total_tabla=()=>{ //Función para modificar le total en la tabla
    let total = carrito.reduce((acumulador, producto) => acumulador + producto.precio_unidades, 0); //Reducir a un único valor del arreglo carrito el atributo precio
    let td_total = document.getElementById("td_total"); //Declarar una variable como id td_total
    td_total.innerHTML = `$ ${total}`; //Cambiar el texto interno de tabla total
}

function cargar_carrito(){
    let recuperar_carrito = localStorage.getItem("carrito"); //Mandar a llamar almacenamiento local
    if(recuperar_carrito){
        recuperar_carrito = JSON.parse(recuperar_carrito); //Convertir archivo JSON a arreglo de JS
        carrito = recuperar_carrito; //Sobre escribit arreglo carrito con arreglo recuperar_carrito
        mostrar_carrito(); //Función mostrar carrito
    }
}

function check_out_carrito(){
    let total = document.getElementById("td_total").innerText; //Obtener el texto interno del id td_total que es de la tabla
    if(carrito.length>0){ //Si el largo del arreglo es mayor a 0 entonces
        let alerta = document.getElementById("alerta"); //Decalrar una variable como id dentro del HTML
        //Imprimir un HTML bootstrap dentro del id alerta
        alerta.innerHTML=`<div class="alert alert-success" role="alert"> 
                            Favor de pagar ${total}
                        </div>`;
    }else{ //Si el largo del arreglo no es mayor a 0 entonces
        let alerta = document.getElementById("alerta");//Decalrar una variable como id dentro del HTML
        //Imprimir un HTML bootstrap dentro del id alerta
        alerta.innerHTML=`<div class="alert alert-danger" role="alert">
                            ¡El carrito está vacío!
                        </div>`;
        total = 0; //Resetear valor de total para confirmar que todo elemento esté vacío
        let td_total = document.getElementById("td_total"); //Declarar una variable como selección del id td_total
        td_total.innerHTML = `${total}`; //Resetear el valor interno del HTML con id td_total a cero
        carrito = []; //Limpiar carrito
        localStorage.clear();
    } 
    guardado_carrito(); //Llamar función de guardar en JSON
}

function agregar_carrito(e){ //Función para agregar a carrito
    let tarjeta = e.target.parentNode.parentNode; //Composición parent del botón Añadir a su tarjeta
    let nombre_producto = tarjeta.querySelector("h3").textContent; //Obtener el texto del h3 de la tarjeta
    let precio_producto = tarjeta.querySelector("span").textContent; //Obtener el texto del span de la tarjeta
    let img_producto = tarjeta.querySelector("img").src; //Obtener la ruta de la imagen de la tarjeta

    if (producto_ya_seleccionado(nombre_producto)){ //Si el producto seleccionado regresa verdadero entonces
        let alerta = document.getElementById("alerta"); //Decalrar una variable como id dentro del HTML
        //Imprimir un HTML bootstrap dentro del id alerta
        alerta.innerHTML=`<div class="alert alert-warning" role="alert">
                            Producto ya seleccionado
                        </div>`;
    }else{ ////Si el producto seleccionado regresa falso entonces
        let producto = { //Construir objeto
            nombre: nombre_producto, //Elementos de la tarjeta
            precio: parseInt(precio_producto),
            precio_unidades: parseInt(precio_producto),
            cantidad: 1, //La selección predispone una unidad
            img: img_producto,
        };
        carrito.push(producto); //Empujar objeto al arreglo carrito
        mostrar_carrito(); //Función para modificar el HTML
    };
    carrito.forEach(carrito=>{ //Para cada elemento del arreglo carrito
        carrito.SKU = generar_SKU(); //Crear atributo SKU que es el mandar a llamar función generar_SKU
    })
    guardado_carrito(); //Función guardar en carrito
}

function borrar_carrito(e){ //Función para eliminar un producto
    let fila = e.target.parentNode.parentNode; //Declarar variable como target de en d0nde sucede el evento y sacar su abuelo parent
    fila.remove(); //Remover fila del HTML
    let producto_nombre = fila.querySelector(".producto_nombre").textContent; //Seleccionar todo contenido texto de id producto_nombre desde su abuelo parent
    carrito = carrito.filter(producto => producto.nombre !== producto_nombre); //Filtrar, pasan, objetos del arreglo carrito que no sean iguales producto nombre
    guardado_carrito(); //Llamar función de guardar en JSON
    total_tabla(); //Mandar a llamar función total_tabla
}

function actualizar_cantidad(e) { //Función para actualizar cantidad
    let contador = e.target.parentNode.querySelector(".contador"); //Seleccionar el id contador de donde ocurre el evento
    let cantidad = parseInt(contador.textContent); //Convertir el dato de texto interno a integer
    let accion = e.target.textContent; //Del lugar en donde ocurre, regresa + o - como contenido del texto

    if (accion === "+") { //Si la acción es texto +
        cantidad++; //Aumentar cantidad
    }else if (accion === "-"){ //Si la acción es texto -
        if (cantidad > 0) { //Y cantidad mayor a 0
            cantidad--; //Reducir cantidad
        }
    }
    contador.textContent = cantidad; //El texto dentro del lugar contador ahora es la cantidad

    let producto_nombre = e.target.parentNode.parentNode.parentNode.querySelector(".producto_nombre").textContent; //Seleccionar id producto_nombre para obtener nombre del producto
    let producto = carrito.find((p) => p.nombre === producto_nombre); //Declarar una variable como un objeto con atributo nombre que sea igual al nombre del producto
    producto.cantidad = cantidad; //Sobre escritura para el texto interno

    if (cantidad === 0){ //Si la cantidad es igual a 0 entonces
        let fila = e.target.parentNode.parentNode.parentNode; //Declarar variable como toda la selección de hijos desde el elemento fila creado al principio
        fila.remove(); //Remover
        producto_nombre = fila.querySelector(".producto_nombre").textContent; //Seleccionar texto con id producto_nombre para sacar el nombre del producto
        carrito = carrito.filter((producto)=> producto.nombre !== producto_nombre); //Filtrar del arreglo carrito todo elemento que no sea igual a lo obtenido en el paso anterior
    }

    producto.precio_unidades = producto.cantidad*producto.precio; //Dentro del arreglo carrito, tomar el objeto producto y declarar su atributo precio_unidades multiplicando su cantidad y precio
    let precio_de_unidades = e.target.parentNode.parentNode.parentNode.querySelector(".precio_de_unidades"); //Declarar variable de precio de unidades como en donde ocurre la acción de toda su fila de tabla 
    precio_de_unidades.innerHTML = `${producto.precio_unidades}`; //Reemplazar ese texto con la información del arreglo de objeto
    guardado_carrito();  //Función guardar en carrito
    total_tabla(); //Mandar a llamar función para modificar el total de la tabla
}