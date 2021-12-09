// Función para almacenar valor del Año seleccionados luego de dar click al botón Buscar
$("#search_reporte").submit(function(event){
    event.preventDefault();
    let selected_año = $("#combo_año_flujo").val();

    // console.log(selected_año);

    (selected_año==null)?
    window.localStorage.setItem('flujo', JSON.stringify({selected_año : null})) :
    (
    window.localStorage.setItem('flujo', JSON.stringify({selected_año : selected_año})) &
    window.location.replace(`/reporte-flujo?flujo=${selected_año}`)
    );
});

// Función de carga de la página, indica que debe traer el Concepto y Año almacenados previamente"
$(window).on("load", function() {
    let storage = null; //inicializar variable de almacenamiento del concepto y año
    storage = window.localStorage.getItem('flujo');
    storage = JSON.parse(storage);

    // console.log(storage);

    (storage.selected_año == null)? 
    $("#content_flujo").css('visibility', 'hidden'):
    (
    $("#content_flujo").css('visibility', 'visible') &
    $("#table_title").text(`Año ${storage.selected_año}`)
    );
});