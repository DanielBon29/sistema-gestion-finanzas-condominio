// Script para asignar el listado de años de acuerdo a la selección del concepto
$("#combo_concepto").change(function () {
    let concepto = ""; //inicializa concepto
    $("#combo_año").empty(); //inicializa lista de años a mostrar en el combobox

    $("#combo_concepto option:selected" ).each(function() {
    concepto = $( this ).text(); //almacena el concepto seleccionado
    });

    fetch('/api/ingreso') //trae los datos de ingresos para manipular en formato JSON
    .then(response => response.json())
    .then(data => {
        let ingresos_validos = data.filter(item => item.estado == "Válido"); //filtra los objetos que cumplan la condicion de ingreso "Válido"
        let ingresos_val_concepto = ingresos_validos.filter(item => item.concepto == concepto); //filtra los objetos que cumplan la condicion del concepto seleccionado
        let años = [...new Set(ingresos_val_concepto.map(item => item.periodo.substring(0,4)))]; //mapea el listado de años existententes en el concepto seleccionado
        años.sort((a,b) => (a > b) ? -1 : ((b > a) ? 1 : 0)) // años sorting desc
        let options = "";

        for(i = 0; i < años.length; i++) {
            options = options + `<option>${años[i]}</option>`; //se crea un string con las opciones a insertar en el elemento combobox 
        };

        $("#combo_año").append(options);//se inserta el listado de años en el combobox
    })
    .catch(err => console.error(err));            
});

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