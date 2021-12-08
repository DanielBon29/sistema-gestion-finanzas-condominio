

// Descargar Excel
$("#excel_link").click( (x) => {

    fetch('/api/ingreso')
    .then(response => response.json())
    .then(data => {
        const headers = { documento: 'Documento', 
                        fecharegistro: 'Fecha de Registro',
                        nroperacion: 'Nro Operación',
                        cuenta: 'Cuenta',
                        vecino: 'Vecino',
                        monto: 'Monto (S/)',
                        concepto: 'Concepto',
                        periodo: 'Periodo',
                        detalle: 'Detalle',
                        estado: 'Estado' };
        
        data.unshift(headers);
        let workSheet = XLSX.utils.json_to_sheet(data.map(
            ({documento,fecharegistro,nroperacion,cuenta,vecino,monto,concepto,periodo,detalle,estado}) => 
            ({documento,fecharegistro,nroperacion,cuenta,vecino,monto,concepto,periodo,detalle,estado})
            ), 
            {skipHeader: true});

        let workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook,workSheet,"Registro_Ingresos");

        //Generate buffer
        XLSX.write(workBook,{bookType:'xlsx',type:'buffer'});

        //Binary string
        let wbout = XLSX.write(workBook,{bookType:'xlsx',type:'binary'}); 

        //Set filename
        let filename = 'Registro_de_Ingresos_';
        let timestamp = new Date().toLocaleString().replace(/[\/\s:]/g ,x => ({'\/':'_', ' ':'_', ':':'_'})[x]);
        let extension = '.xlsx';

        XLSX.writeFile(workBook,filename+timestamp+extension);
    })
    .catch(err => console.error(err));
});

// Script para asignar el codigo correlativo del documento de ingreso conforme a la fecha de registro y a la cantidad de registros previos (segun el año) -->
$("input[name=fecharegistro]").datepicker({
    onSelect: function(dateText) {
        let año_reg = dateText.slice(-2);

        fetch('/api/ingreso')
        .then(response => response.json())
        .then(data => {
            let contador = data.filter(item => item.fecharegistro.slice(-2) == año_reg).length;
            let correlativo = (contador+1).toString().padStart(4,0);
            let doc = `I${año_reg}-${correlativo}`;

            $("input[name=documento]").val(doc);
            $("h2").text(`Nuevo ingreso "${doc}"`);
        })
        .catch(err => console.error(err));
    }
});

// Scripts for Registro de Ingresos
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

$("#update_ingreso").submit(function(event){
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
        "url": `/api/ingreso/${data.id}`,
        "method": "PUT",
        "data": data
    };

    
    $.ajax(request).done(function(response){
        alert("Datos modificados exitosamente");
        $("#overlay, #PleaseWait").show();
    });

    window.location.replace("/comprobante-ingreso-modificado?id="+data.id);
});

if(window.location.pathname == "/registro-ingresos"){
    $ondelete=$(".table tbody td a.delete");
    $ondelete.click(function(){
        let id=$(this).attr("data-id")

        let request = {
            "url": `/api/ingreso/${id}`,
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