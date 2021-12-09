// Función para almacenar valor del Centro de costo seleccionado luego de dar click al botón Buscar, servirá para redireccionar a formulario de crear
$("#search_proveedores").submit(function(event){
    event.preventDefault();
    let selected_cc = $("#combo_searcher_cc").val();

    window.localStorage.setItem('cc', JSON.stringify({selected_cc : selected_cc}));
    window.location.replace("/nuestros-proveedores?centrocosto="+selected_cc);
});

// Funcion para cuando se crea un proveedor//
$(document).ready(function() {
    $("body").prepend('<div id="overlay" class="ui-widget-overlay" style="z-index: 1001; display: none;"></div>');
    $("body").prepend("<div id='PleaseWait' style='display: none;'><img src='/images/spinner.gif'/></div>");
});

$("#add_proveedor").submit(function(event){
    alert("Datos creados exitosamente");
    $("#overlay, #PleaseWait").show();
});

// Funcion para cuando se modifica un proveedor//
$("#update_proveedor").submit(function(event){
    event.preventDefault();

    let unindexed_array=$(this).serializeArray();
    let data = {};

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value'];    
    });

    // Formatting data before inserting to DB//
    let arr_prov = data.proveedor.split(" ");
    let arr_dir = data.direccion.split(" ");

    for (let i=0; i<arr_prov.length; i++) {
        arr_prov[i] = arr_prov[i].charAt(0).toUpperCase() + arr_prov[i].slice(1).toLowerCase(); 
    };
    for (let i=0; i<arr_dir.length; i++) {
        arr_dir[i] = arr_dir[i].charAt(0).toUpperCase() + arr_dir[i].slice(1).toLowerCase(); 
    };
    let prov_formatted = arr_prov.join(" ");
    let dir_formatted = arr_dir.join(" ");

    data.proveedor = prov_formatted;
    data.direccion = dir_formatted;
    data.email = data.email.toLowerCase();
    //

    let request = {
        "url": `/api/proveedor/${data.id}`,
        "method": "PUT",
        "data": data
    };

    $.ajax(request).done(function(response){
        alert("Datos modificados exitosamente");
        $("#overlay, #PleaseWait").show();
    });

    window.location.replace('/nuestros-proveedores?centrocosto='+data.centrocosto);
});

// Funcion para cuando se elimina un proveedor//
if(window.location.pathname == "/nuestros-proveedores"){
    $ondelete=$(".table tbody td a.delete");
    $ondelete.click(function(){
        let id=$(this).attr("data-id")

        let request = {
            "url": `/api/proveedor/${id}`,
            "method": "DELETE"
        };

        if(confirm("Confirme que desea eliminar estos datos")) {
            $.ajax(request).done(function(response){
                alert("Datos eliminados exitosamente");
                $("#overlay, #PleaseWait").show();
                location.reload();
            });   
        }

    })
};