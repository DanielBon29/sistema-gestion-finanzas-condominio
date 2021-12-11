// Función para almacenar valor del Concepto y Año seleccionados luego de dar click al botón Buscar
$("#search_reporte").submit(function(event){
    event.preventDefault();
    let selected_concepto = $("#combo_concepto").val();
    let selected_año = $("#combo_año").val();

    // console.log(selected_concepto,'-', selected_año);

    (selected_concepto==null || selected_año==null)?
    window.localStorage.setItem('reporte', JSON.stringify({selected_concepto : null, selected_año : null})) :
    (
    window.localStorage.setItem('reporte', JSON.stringify({selected_concepto : selected_concepto, selected_año : selected_año})) &
    window.location.replace(`/reporte-morosidad?concepto=${selected_concepto}&anio=${selected_año}`)
    );
});

// Función de carga de la página, indica que debe traer el Concepto y Año almacenados previamente"
$(window).on("load", function() {
    let storage = null; //inicializar variable de almacenamiento del concepto y año
    storage = window.localStorage.getItem('reporte');
    storage = JSON.parse(storage);

    // console.log(storage);

    (storage.selected_concepto == null || storage.selected_año == null)? 
    $("#content_mor").css('visibility', 'hidden'):
    (
    $("#content_mor").css('visibility', 'visible') &
    $("#table_title").text(`${storage.selected_concepto} del ${storage.selected_año}`)
    );
});