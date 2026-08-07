/*=======================================
  DASHBOARD
=========================================*/
window.addEventListener("load", function(){
    cargarDashboard();
});

function cargarDashboard(){
    document
        .getElementById("overlayCarga")
        .classList
        .add("mostrar");
    const inicio = performance.now();
    fetch(
        "https://script.google.com/macros/s/AKfycbxCdDy-UJ5gG8ghlZHnhARXumSJPibwnW8ELfU9u8a45BNl33YIy-6GPvHvhZGiqXgn/exec?accion=dashboard"
    )
    .then(r => r.json())
    .then(function(datos){
        cargarKPIs(datos);
        cargarIncidencias(datos.listaIncidencias);
        cargarUltimasMarcaciones(datos.ultimasMarcaciones);
        cargarResumen(datos.resumen);
        actualizarHora();
    })
    .catch(function(error){
        console.error(error);
    })
    .finally(function(){
        document
            .getElementById("overlayCarga")
            .classList
            .remove("mostrar");
    });
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

function actualizarHora(){
    const ahora = new Date();
    document.getElementById("horaActualizacion")
        .textContent =
        ahora.toLocaleTimeString(
            "es-AR",
            {
                hour:"2-digit",
                minute:"2-digit",
                second:"2-digit",
                hour12: false
            }
        );
}
document
    .getElementById("overlayCarga")
    .classList
    .remove("mostrar");
document
    .getElementById("btnActualizarDashboard")
    .addEventListener(
        "click",
        cargarDashboard
    );
document
    .getElementById("menuEmpleados")
    .addEventListener(
        "click",
        mostrarEmpleados
    );

function mostrarEmpleados(e){
    e.preventDefault();
    document
        .getElementById("dashboard")
        .style.display = "none";
    document
        .getElementById("empleados")
        .style.display = "block";
    document
        .getElementById("menuDashboard")
        .classList.remove("activo");
    document
        .getElementById("menuEmpleados")
        .classList.add("activo");
    if(listaEmpleados.length == 0){
        cargarEmpleados();
  }
}

document
    .getElementById("menuDashboard")
    .addEventListener(
        "click",
        mostrarDashboard
    );

function mostrarDashboard(e){
    if(e){
        e.preventDefault();
    }
    document
        .getElementById("dashboard")
        .style.display = "block";
    document
        .getElementById("empleados")
        .style.display = "none";
    document
        .getElementById("menuDashboard")
        .classList.add("activo");
    document
        .getElementById("menuEmpleados")
        .classList.remove("activo");
  }

let empleadoSeleccionado = null;
let listaEmpleados = [];
function cargarEmpleados(){
    fetch("https://script.google.com/macros/s/AKfycbxCdDy-UJ5gG8ghlZHnhARXumSJPibwnW8ELfU9u8a45BNl33YIy-6GPvHvhZGiqXgn/exec?accion=empleados")
    .then(r => r.json())
    .then(function(empleados){
        listaEmpleados = empleados;
        renderizarEmpleados(listaEmpleados);
    })
    .catch(function(error){
        console.error(error);
    });
}


function renderizarEmpleados(lista){
    const tabla =
        document.getElementById("tablaEmpleados");
    tabla.innerHTML = "";
    lista.forEach(function(e){
        tabla.innerHTML += `
            <tr>
                <td>${e.legajo}</td>
                <td>${e.dni}</td>
                <td>${e.apellido}</td>
                <td>${e.nombre}</td>
                <td>${e.sucursal}</td>
                <td>${e.turno}</td>
                <td>${e.estado}</td>
                <td>
                    <button
                    class="btnEditarEmpleado"
                    onclick="editarEmpleado('${e.dni}')"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </td>
            </tr>
        `;
    });
}

document
    .getElementById("buscarEmpleado")
    .addEventListener(
        "input",
        filtrarEmpleados
    );
function filtrarEmpleados(){
    const texto = this.value
        .trim()
        .toLowerCase();
    if(texto == ""){
        renderizarEmpleados(listaEmpleados);
        return;
    }
    const resultado = listaEmpleados.filter(function(e){
        return (
            String(e.legajo).includes(texto) ||
            e.dni.includes(texto) ||
            e.apellido.toLowerCase().includes(texto) ||
            e.nombre.toLowerCase().includes(texto)
        );
    });
    renderizarEmpleados(resultado);
}

let empleadoSeleccionado = null;
let modoEmpleado = "editar";

function editarEmpleado(dni){
    empleadoSeleccionado = listaEmpleados.find(function(e){
        return e.dni == dni;
    });
    if(!empleadoSeleccionado){
        return;
    }
    modoEmpleado = "editar";
    abrirModalEmpleado();
}
function nuevoEmpleado(){
    modoEmpleado = "nuevo";
    empleadoSeleccionado = {
        legajo:"",
        dni:"",
        apellido:"",
        nombre:"",
        sucursal:"",
        turno:"",
        estado:"ACTIVO"
    };
    abrirModalEmpleado();
}
function abrirModalEmpleado(){
    document.getElementById("txtLegajo").value =
       empleadoSeleccionado.legajo;
    document.getElementById("txtDni").value =
        empleadoSeleccionado.dni;
    document.getElementById("txtApellido").value =
        empleadoSeleccionado.apellido;
    document.getElementById("txtNombre").value =
        empleadoSeleccionado.nombre;
    document.getElementById("txtSucursal").value =
        empleadoSeleccionado.sucursal;
    document.getElementById("txtTurno").value =
        empleadoSeleccionado.turno;
    document.getElementById("txtEstado").value =
        empleadoSeleccionado.estado;
    document.getElementById("tituloModalEmpleado")
        .textContent =
       modoEmpleado == "nuevo"
        ? "Nuevo empleado"
        : "Editar empleado";
    document.getElementById("modalEmpleado")
        .style.display = "flex";
}
function cerrarModalEmpleado(){
    document.getElementById("modalEmpleado")
        .style.display = "none";
}
function validarFormularioEmpleado(){
    if(
       document.getElementById("txtApellido")
        .value.trim() == ""
    ){
        return false;
    }
    if(
        document.getElementById("txtNombre")
        .value.trim() == ""
    ){
        return false;
    }
    return true;
}
function guardarEmpleado(){
    if(!validarFormularioEmpleado()){
        alert("Complete los datos obligatorios.");
        return;
    }
    console.log("Guardar empleado");
}
function limpiarFormularioEmpleado(){
    document.getElementById("txtLegajo").value = "";
    document.getElementById("txtDni").value = "";
    document.getElementById("txtApellido").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtSucursal").value = "";
    document.getElementById("txtTurno").value = "";
    document.getElementById("txtEstado").value = "ACTIVO";
}
