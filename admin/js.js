/*=========================================
  DASHBOARD
=========================================*/
window.addEventListener("load", cargarDashboard);
function cargarDashboard(){
    const inicio = performance.now();
    fetch(
        "https://script.google.com/macros/s/AKfycbxCdDy-UJ5gG8ghlZHnhARXumSJPibwnW8ELfU9u8a45BNl33YIy-6GPvHvhZGiqXgn/exec?accion=dashboard")
    .then(r => {
        console.log(
            "Respuesta recibida:",
            (performance.now()-inicio).toFixed(0),
            "ms"
        );
        return r.json();
    })
    .then(function(datos){
        console.log(
            "JSON parseado:",
            (performance.now()-inicio).toFixed(0),
            "ms"
        );
        cargarKPIs(datos);
        cargarIncidencias(datos.listaIncidencias);
        cargarUltimasMarcaciones(datos.ultimasMarcaciones);
        cargarResumen(datos.resumen);
        console.log(
            "Dashboard cargado:",
            (performance.now()-inicio).toFixed(0),
            "ms"
        );
    })

    .catch(console.error);

}

function cargarKPIs(datos){
    document.getElementById("kpiPresentes").innerHTML =
        datos.presentes;
    document.getElementById("kpiAlmuerzo").innerHTML =
        datos.almuerzo;
    document.getElementById("kpiAusentes").innerHTML =
        datos.ausentes;
    document.getElementById("kpiIncidencias").innerHTML =
        datos.incidencias;
}

function cargarIncidencias(lista){
    const contenedor =
        document.getElementById("listaIncidencias");
    contenedor.innerHTML = "";
    if(lista.length == 0){
        contenedor.innerHTML = `
            <div class="sin-datos">
                No se registraron incidencias hoy.
            </div>
        `;

        return;
    }
    let sucursalActual = "";
    lista.forEach(function(item){
        if(item.sucursal != sucursalActual){
            sucursalActual = item.sucursal;
            contenedor.innerHTML += `
                <div class="tituloSucursal">
                    ${item.sucursal}
                </div>
            `;
        }
        contenedor.innerHTML += `
            <div class="incidencia">
                <div class="empleado">
                    ${item.empleado}
                </div>
                <div class="tipo">
                    ${item.tipo}
                </div>
                <div class="observacion">
                    ${item.observacion}
                </div>
            </div>
        `;
    });
}

function cargarUltimasMarcaciones(lista){
    const contenedor =
        document.getElementById("listaMarcaciones");
    contenedor.innerHTML = "";
    if(lista.length == 0){
        contenedor.innerHTML = `
            <div class="sin-datos">
                No hay marcaciones para mostrar.
            </div>
        `;
        return;
    }
    lista.forEach(function(item){
        contenedor.innerHTML += `
            <div class="marcacion">
                <div class="marcacion-hora">
                    ${item.hora}
                </div>
                <div class="marcacion-empleado">
                    ${item.empleado}
                </div>
                <div class="marcacion-evento">
                    ${item.evento}
                </div>
                <div class="marcacion-sucursal">
                    Sucursal ${item.sucursal}
                </div>
            </div>
        `;
    });
}

function cargarResumen(texto){
    document
        .getElementById("textoResumen")
        .textContent = texto;
}
document
    .getElementById("btnCopiarResumen")
    .addEventListener("click", copiarResumen);

function copiarResumen(){
    const texto = document
        .getElementById("textoResumen")
        .textContent;
    navigator.clipboard
        .writeText(texto)
        .then(function(){
            mostrarNotificacion(
                "ok",
                "Resumen diario copiado."
            );
        })
        .catch(function(){
            mostrarNotificacion(
                "error",
                "No fue posible copiar el resumen."
            );
        });
}

function mostrarNotificacion(tipo, mensaje){
    const notificacion = document.getElementById("notificacion");
    const icono = document.getElementById("notificacionIcono");
    const texto = document.getElementById("notificacionTexto");
    notificacion.className = "notificacion " + tipo;
    if(tipo == "ok"){
        icono.className = "fa-solid fa-circle-check";
    }else{
        icono.className = "fa-solid fa-circle-xmark";
    }
    texto.textContent = mensaje;
    notificacion.classList.add("mostrar");
    setTimeout(function(){
        notificacion.classList.remove("mostrar");
    },3000);
}
