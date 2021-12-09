// Descargar Excel
$("#excel_link").click( (x) => {

    fetch('/api/egreso')
    .then(response => response.json())
    .then(data => {
        const headers = { documento: 'Documento', 
                        fecharegistro: 'Fecha de Registro',
                        nrcomprobante: 'Nro Comprobante',
                        centrocosto: 'Centro de Costo',
                        proveedor: 'Proveedor',
                        monto: 'Monto (S/)',
                        cuenta: 'Cuenta',                          
                        periodo: 'Periodo',
                        detalle: 'Detalle',
                        estado: 'Estado' };
        
        data.unshift(headers);
        let workSheet = XLSX.utils.json_to_sheet(data.map(
            ({documento,fecharegistro,nrcomprobante,centrocosto,proveedor,monto,cuenta,periodo,detalle,estado}) => 
            ({documento,fecharegistro,nrcomprobante,centrocosto,proveedor,monto,cuenta,periodo,detalle,estado})
            ), 
            {skipHeader: true});

        let workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook,workSheet,"Registro_Egresos");

        //Generate buffer
        XLSX.write(workBook,{bookType:'xlsx',type:'buffer'});

        //Binary string
        let wbout = XLSX.write(workBook,{bookType:'xlsx',type:'binary'}); 

        //Set filename
        let filename = 'Registro_de_Egresos_';
        let timestamp = new Date().toLocaleString().replace(/[\/\s:]/g ,x => ({'\/':'_', ' ':'_', ':':'_'})[x]);
        let extension = '.xlsx';

        XLSX.writeFile(workBook,filename+timestamp+extension);
    })
    .catch(err => console.error(err));
});

// Script para asignar el codigo correlativo del documento de egreso conforme a la fecha de registro y a la cantidad de registros previos (segun el año) -->
$("input[name=fecharegistro]").datepicker({
    onSelect: function(dateText) {
        let año_reg = dateText.slice(-2); //Se obtienen los 2 ultimos digitos de la fecha de registro.

        fetch('/api/egreso') //trae los datos de egreso para manipular en formato JSON
        .then(response => response.json())
        .then(data => {
            let contador = data.filter(item => item.fecharegistro.slice(-2) == año_reg).length; //filtra los objetos que cumplan la condicion del año seleccionado y muestra la longitud
            let correlativo = (contador+1).toString().padStart(4,0); //el contador es convertido a String y luego en formato ####
            let doc = `E${año_reg}-${correlativo}`;

            $("input[name=documento]").val(doc);
            $("h2").text(`Nuevo egreso "${doc}"`);
        })
        .catch(err => console.error(err));
    }
});

// Script para asignar el listado de proveedores de acuerdo a la selección del centro de costo -->
$("#combo_cc" ).change(function () {
    let cc = ""; //inicializa centro de costo
    $("#combo_proveedores").empty(); //inicializa lista de proveedores a mostrar en el combobox

    $("#combo_cc option:selected" ).each(function() {
    cc = $( this ).text(); //almacena el centro de costo seleccionado
    });

    fetch('/api/proveedor') //trae los datos de proveedor para manipular en formato JSON
    .then(response => response.json())
    .then(data => {
        let data_filtered = data.filter(item => item.centrocosto == cc); //filtra los objetos que cumplan la condicion del centro de costo seleccionado
        let prov_array = data_filtered.map(a => a.proveedor); //mapea el listado de proveedores de los objetos filtrados previamente

        let options = "";
        for(i = 0; i < prov_array.length; i++) {
            options = options + `<option>${prov_array[i]}</option>`; //se crea un string con las opciones a insertar en el elemento combobox 
        };

        $("#combo_proveedores").append(options);//se inserta el listado de proveedores en el combobox
    })
    .catch(err => console.error(err));            
});

// Scripts for Registro de Egresos
$(document).ready(function() {
    $("body").prepend('<div id="overlay" class="ui-widget-overlay" style="z-index: 1001; display: none;"></div>');
    $("body").prepend("<div id='PleaseWait' style='display: none;'><img src='/images/spinner.gif'/></div>");
});

function isValidForm() {
    if($("input[name=fecharegistro]").val() == '') {
        $("input[name=fecharegistro]").addClass('red');
        return false;
    } else {
        alert("Datos creados exitosamente");
        $("#overlay, #PleaseWait").show();
        return true;
    }
};

$("#update_egreso").submit(function(event){
    event.preventDefault();

    let unindexed_array=$(this).serializeArray();
    let data = {};

    $.map(unindexed_array,function(n,i){
        data[n['name']] = n['value'];    
    });

    console.log(data);

    // Formatting data before inserting to DB//

    //

    let request = {
        "url": `/api/egreso/${data.id}`,
        "method": "PUT",
        "data": data
    };

    $.ajax(request).done(function(response){
        alert("Datos modificados exitosamente");
        $("#overlay, #PleaseWait").show();
    });

    window.location.replace("/comprobante-egreso-modificado?id="+data.id);
});

if(window.location.pathname == "/registro-egresos"){
    $ondelete=$(".table tbody td a.delete");
    $ondelete.click(function(){
        let id=$(this).attr("data-id")

        let request = {
            "url": `/api/egreso/${id}`,
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