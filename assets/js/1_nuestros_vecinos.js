// Scripts for Vecinos
$(document).ready(function() {
    $("body").prepend('<div id="overlay" class="ui-widget-overlay" style="z-index: 1001; display: none;"></div>');
    $("body").prepend("<div id='PleaseWait' style='display: none;'><img src='/images/spinner.gif'/></div>");
});

$("#add_vecino").submit(function(event){
    alert("Datos creados exitosamente");
    $("#overlay, #PleaseWait").show();
});

$("#update_vecino").submit(function(event){
    event.preventDefault();

    let unindexed_array=$(this).serializeArray();
    let data = {};

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value'];    
    });

    console.log(data);

    // Formatting data before inserting to DB//
    let arr_vecino = data.vecino.split(" ");

    for (let i=0; i<arr_vecino.length; i++) {
        arr_vecino[i] = arr_vecino[i].charAt(0).toUpperCase() + arr_vecino[i].slice(1).toLowerCase(); 
    }

    let vecino_formatted = arr_vecino.join(" ");

    data.vecino = vecino_formatted;
    data.email1 = data.email1.toLowerCase();
    data.email2 = data.email2.toLowerCase();
    //

    let request = {
        "url": `http://localhost:3000/api/users/${data.id}`,
        "method": "PUT",
        "data": data
    };

    $.ajax(request).done(function(response){
        alert("Datos modificados exitosamente");
        $("#overlay, #PleaseWait").show();
    });

    window.location.replace("/nuestros-vecinos");
});

if(window.location.pathname == "/nuestros-vecinos"){
    $ondelete=$(".table tbody td a.delete");
    $ondelete.click(function(){
        let id=$(this).attr("data-id")

        let request = {
            "url": `http://localhost:3000/api/users/${id}`,
            "method": "DELETE"
        };

        if(confirm("Confirme que desea eliminar estos datos")) {
            $.ajax(request).done(function(response){
                alert("Datos eliminados exitosamente");
                location.reload();
            });   
        }

    })
}