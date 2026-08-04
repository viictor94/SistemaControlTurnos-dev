/*=========================================
  DASHBOARD
=========================================*/

window.addEventListener("load", cargarDashboard);

function cargarDashboard(){

    fetch(
        "https://script.google.com/macros/s/AKfycbxCdDy-UJ5gG8ghlZHnhARXumSJPibwnW8ELfU9u8a45BNl33YIy-6GPvHvhZGiqXgn/exec"
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
