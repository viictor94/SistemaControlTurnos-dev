/*=========================================
  DASHBOARD
=========================================*/

window.addEventListener("load", cargarDashboard);

function cargarDashboard(){

    fetch(
        "TU_URL_DEL_APPS_SCRIPT"
        + "?accion=dashboard"
    )

    .then(r => r.json())

    .then(cargarKPIs)

    .catch(function(error){

        console.error(error);

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
