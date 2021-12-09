// Scripts for Junta Directiva
$(document).ready(function() {
    $("body").prepend('<div id="overlay" class="ui-widget-overlay" style="z-index: 1001; display: none;"></div>');
    $("body").prepend("<div id='PleaseWait' style='display: none;'><img src='/images/spinner.gif'/></div>");
});

$("#add_junta").submit(function(event){
    alert("Datos creados exitosamente");
    $("#overlay, #PleaseWait").show();
});

$("#update_junta").submit(function(event){
    event.preventDefault();

    let unindexed_array=$(this).serializeArray();
    let data = {};

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value'];    
    });

    // Formatting data before inserting to DB//
    let arr_pre = data.presidencia.split(" ");
    let arr_tes = data.tesoreria.split(" ");
    let arr_sec = data.secretaria.split(" ");
    let arr_adm = data.administracion.split(" ");

    for (let i=0; i<arr_pre.length; i++) {
        arr_pre[i] = arr_pre[i].charAt(0).toUpperCase() + arr_pre[i].slice(1).toLowerCase(); 
    };
    for (let i=0; i<arr_tes.length; i++) {
        arr_tes[i] = arr_tes[i].charAt(0).toUpperCase() + arr_tes[i].slice(1).toLowerCase(); 
    };
    for (let i=0; i<arr_sec.length; i++) {
        arr_sec[i] = arr_sec[i].charAt(0).toUpperCase() + arr_sec[i].slice(1).toLowerCase(); 
    };
    for (let i=0; i<arr_adm.length; i++) {
        arr_adm[i] = arr_adm[i].charAt(0).toUpperCase() + arr_adm[i].slice(1).toLowerCase(); 
    };

    let pre_formatted = arr_pre.join(" ");
    let tes_formatted = arr_tes.join(" ");
    let sec_formatted = arr_sec.join(" ");
    let adm_formatted = arr_adm.join(" ");

    data.presidencia = pre_formatted;
    data.tesoreria = tes_formatted;
    data.secretaria = sec_formatted;
    data.administracion = adm_formatted;
    //
    
    let request = {
        "url": `/api/junta/${data.id}`,
        "method": "PUT",
        "data": data
    };

    $.ajax(request).done(function(response){
        alert("Datos modificados exitosamente");
        $("#overlay, #PleaseWait").show();
    });

    window.location.replace("/junta-directiva");

});

if(window.location.pathname == "/junta-directiva"){
    $ondelete=$(".table tbody td a.delete");
    $ondelete.click(function(){
        let id=$(this).attr("data-id")

        let request = {
            "url": `/api/junta/${id}`,
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
}
