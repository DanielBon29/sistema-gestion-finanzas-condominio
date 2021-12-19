const axios = require('axios');
const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options_i = require('../../helper/pdf_ingreso_options');
const options_e = require('../../helper/pdf_egreso_options');

// //Render Comprobante Ingreso

exports.generateIngresoPdf = (req, res) => {
    let _this = res; //creado para usarlo en el render dentro de la funcion "crear PDF", esto para renderizar la confirmacion luego de creado el PDF
    const source1 = axios.get('http://localhost:3000/api/ingreso',{params:{id:req.query.id}});
    const source2 = axios.get('http://localhost:3000/api/junta');
    const source3 = axios.get('http://localhost:3000/api/users');

    axios.all([source1,source2,source3])
    .then(axios.spread((...userdata) => {
        let data_ingreso = userdata[0].data;
        let data_junta = userdata[1].data.filter(item => item.año == parseInt(data_ingreso.fecharegistro.substring(6,10)))[0];

        // Si se crea algun registro en un año posterior en el cual la junta no se ha definido y/o registrado en el sistema, dejar el nombre de tesorería en blanco ""
        data_junta == undefined? data_junta = {tesoreria: ''} : data_junta = data_junta;

        let extrae_letra = data_ingreso.vecino.substring(8,9) == "/"? data_ingreso.vecino.substring(7,10) : data_ingreso.vecino.substring(7,8);
        let data_vecino = userdata[2].data.filter(item => item.letra == extrae_letra)[0];

        const html = fs.readFileSync(path.join(__dirname, '../../views/_pdf_ingreso.html'), 'utf-8');
        const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
        let mes_periodo = parseInt(data_ingreso.periodo.substring(5,7));
        let mes_registro = parseInt(data_ingreso.fecharegistro.substring(3,5));


        const data_i = {
            estado: data_ingreso.estado == 'Anulado'? 'ANULADO' : '',
            documento: data_ingreso.documento.substring(1,8),
            vecino: data_ingreso.vecino,
            monto: data_ingreso.monto.toFixed(2),
            concepto: data_ingreso.concepto,
            periodo: MESES[mes_periodo-1] + ' - ' + data_ingreso.periodo.substring(0,4),
            detalle: data_ingreso.detalle,
            fecharegistro: data_ingreso.fecharegistro.substring(0,2) + ' de ' + MESES[mes_registro-1] + ' del ' + data_ingreso.fecharegistro.substring(6,10)
        };

        const data_j = {
            tesoreria: data_junta.tesoreria
        };

        // Mensaje de Whatsapp
        let wpp_msg = `https://web.whatsapp.com/send?phone=+51${data_vecino.celular}&text=Estimado(a) vecino(a) del Chalet ${data_vecino.letra}: %0a%0aNos es grato saludarle y comunicarle que su pago por concepto de *${data_i.concepto} del Periodo ${data_i.periodo}* ha sido registrado satisfactoriamente.%0aSe adjunta su comprobante de pago electrónico, el cual reemplaza al comprobante físico habitual. De esta manera, contribuímos con el medio ambiente evitando el uso masivo del papel y nos acogemos a la coyuntura actual dada la Emergencia Sanitaria. Por favor, conservarlo para cualquier futura eventualidad. *Puede revisarlo abriendo el siguiente enlace en su navegador de Internet*%0aAgradecemos su activa participación para con nuestro condominio, el cual es hogar de todos. %0a%0a*La Junta Directiva ${data_ingreso.fecharegistro.substring(6,10)}*%0aCalle Enrique Palacios 635 - Miraflores - Lima - Perú`;

        const data_v = {
            vecino: data_vecino.vecino,
            celular: data_vecino.celular,
            email1: data_vecino.email1,
            email2: data_vecino.email2,
            mensaje_wpp: wpp_msg
        };
        
        const origin_root = './' + __dirname.split(path.sep).slice(-3,-1)[0];
        const path_root = `/docs/Ingresos/${data_ingreso.periodo.substring(0,4)}/${data_ingreso.periodo.substring(5,7)}.${MESES[mes_periodo-1]}/${data_ingreso.concepto}/`;
        const filename = `Chalet_${data_vecino.letra.replace("/","")}_${data_ingreso.concepto}_${data_ingreso.periodo.substring(0,4)}_${data_ingreso.periodo.substring(5,7)}_N${data_ingreso.documento.substring(1,8)}.pdf`;
        const document = {
            html: html,
            data: {
                ingreso: data_i,
                junta: data_j,
                vecino: data_v
            },
            path: origin_root + path_root + filename
        };
        // console.log(document.data);
        // console.log(document.path);

        pdf.create(document, options_i)
            .then(res => {
                // console.log(res);
                const filepath = '.' + path_root + filename; //ruta para redireccionar al PDF y verlo en el navegador

                _this.render('4_2_comprobante_ingreso_creado', {
                    path: filepath,
                    vecino: document.data.vecino
                });
            }).catch(error => {
                console.log(error);
            });
    }))
    .catch(err => {
        res.send(err);
    })
};

// //Render Comprobante Egreso

exports.generateEgresoPdf = (req, res) => {
    let _this = res; //creado para usarlo en el render dentro de la funcion "crear PDF", esto para renderizar la confirmacion luego de creado el PDF
    const source1 = axios.get('http://localhost:3000/api/egreso',{params:{id:req.query.id}})
    const source2 = axios.get('http://localhost:3000/api/junta');

    axios.all([source1,source2])
    .then(axios.spread((...userdata) => {
        let data_egreso = userdata[0].data;
        let data_junta = userdata[1].data.filter(item => item.año == parseInt(data_egreso.fecharegistro.substring(6,10)))[0];

        // Si se crea algun registro en un año posterior en el cual la junta no se ha definido y/o registrado en el sistema, dejar el nombre de tesorería en blanco ""
        data_junta == undefined? data_junta = {tesoreria: ''} : data_junta = data_junta;

        const html = fs.readFileSync(path.join(__dirname, '../../views/_pdf_egreso.html'), 'utf-8');
        const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
        let mes_periodo = parseInt(data_egreso.periodo.substring(5,7));
        let mes_registro = parseInt(data_egreso.fecharegistro.substring(3,5));


        const data_e = {
            estado: data_egreso.estado == 'Anulado'? 'ANULADO' : '',
            documento: data_egreso.documento.substring(1,8),
            proveedor: data_egreso.proveedor,
            monto: data_egreso.monto.toFixed(2),
            periodo: MESES[mes_periodo-1] + ' - ' + data_egreso.periodo.substring(0,4),
            detalle: data_egreso.detalle,
            nrcomprobante: data_egreso.nrcomprobante,
            centrocosto: data_egreso.centrocosto,
            cuenta: data_egreso.cuenta,
            fecharegistro: data_egreso.fecharegistro.substring(0,2) + ' de ' + MESES[mes_registro-1] + ' del ' + data_egreso.fecharegistro.substring(6,10)
        };

        const data_j = {
            tesoreria: data_junta.tesoreria
        };

        const origin_root = './' + __dirname.split(path.sep).slice(-3,-1)[0];
        const path_root = `/docs/Egresos/${data_egreso.periodo.substring(0,4)}/${data_egreso.periodo.substring(5,7)}.${MESES[mes_periodo-1]}/${data_egreso.centrocosto}/`;
        const filename = `${data_egreso.proveedor.replace("/","-")}_${data_egreso.periodo.substring(0,4)}_${data_egreso.periodo.substring(5,7)}_N${data_egreso.documento.substring(1,8)}.pdf`;
        const document = {
            html: html,
            data: {
                egreso: data_e,
                junta: data_j
            },
            path: origin_root + path_root + filename
        };

        pdf.create(document, options_e)
            .then(res => {
                // console.log(res);
                const filepath = '.' + path_root + filename; //ruta para redireccionar al PDF y verlo en el navegador

                _this.render('5_2_comprobante_egreso_creado', {
                    path: filepath
                });
            }).catch(error => {
                console.log(error);
            });
    }))
    .catch(err => {
        res.send(err);
    })
};

// //Render Comprobante Ingreso Modificado

exports.modifyIngresoPdf = (req, res) => {
    let _this = res; //creado para usarlo en el render dentro de la funcion "crear PDF", esto para renderizar la confirmacion luego de modificado el PDF
    const source1 = axios.get('http://localhost:3000/api/ingreso',{params:{id:req.query.id}})
    const source2 = axios.get('http://localhost:3000/api/junta');
    const source3 = axios.get('http://localhost:3000/api/users');

    axios.all([source1,source2,source3])
    .then(axios.spread((...userdata) => {
        let data_ingreso = userdata[0].data;
        let data_junta = userdata[1].data.filter(item => item.año == parseInt(data_ingreso.fecharegistro.substring(6,10)))[0];

        // Si se crea algun registro en un año posterior en el cual la junta no se ha definido y/o registrado en el sistema, dejar el nombre de tesorería en blanco ""
        data_junta == undefined? data_junta = {tesoreria: ''} : data_junta = data_junta;

        let extrae_letra = data_ingreso.vecino.substring(8,9) == "/"? data_ingreso.vecino.substring(7,10) : data_ingreso.vecino.substring(7,8);
        let data_vecino = userdata[2].data.filter(item => item.letra == extrae_letra)[0];

        const html = fs.readFileSync(path.join(__dirname, '../../views/_pdf_ingreso.html'), 'utf-8');
        const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
        let mes_periodo = parseInt(data_ingreso.periodo.substring(5,7));
        let mes_registro = parseInt(data_ingreso.fecharegistro.substring(3,5));


        const data_i = {
            estado: data_ingreso.estado == 'Anulado'? 'ANULADO' : '',
            documento: data_ingreso.documento.substring(1,8),
            vecino: data_ingreso.vecino,
            monto: data_ingreso.monto.toFixed(2),
            concepto: data_ingreso.concepto,
            periodo: MESES[mes_periodo-1] + ' - ' + data_ingreso.periodo.substring(0,4),
            detalle: data_ingreso.detalle,
            fecharegistro: data_ingreso.fecharegistro.substring(0,2) + ' de ' + MESES[mes_registro-1] + ' del ' + data_ingreso.fecharegistro.substring(6,10)
        };

        const data_j = {
            tesoreria: data_junta.tesoreria
        };

        const data_v = {
            vecino: data_vecino.vecino,
            celular: data_vecino.celular,
            email1: data_vecino.email1,
            email2: data_vecino.email2
        };

        const origin_root = './' + __dirname.split(path.sep).slice(-3,-1)[0];
        const path_root = `/docs/Ingresos/${data_ingreso.periodo.substring(0,4)}/${data_ingreso.periodo.substring(5,7)}.${MESES[mes_periodo-1]}/${data_ingreso.concepto}/`;
        const filename = `Chalet_${data_vecino.letra.replace("/","")}_${data_ingreso.concepto}_${data_ingreso.periodo.substring(0,4)}_${data_ingreso.periodo.substring(5,7)}_N${data_ingreso.documento.substring(1,8)}.pdf`;
        const document = {
            html: html,
            data: {
                ingreso: data_i,
                junta: data_j,
                vecino: data_v
            },
            path: origin_root + path_root + filename
        };

        pdf.create(document, options_i)
            .then(res => {
                // console.log(res);
                const filepath = '.' + path_root + filename; //ruta para redireccionar al PDF y verlo en el navegador

                _this.render('4_4_comprobante_ingreso_modificado', {
                    path: filepath
                });
            }).catch(error => {
                console.log(error);
            });
    }))
    .catch(err => {
        res.send(err);
    })
};

// //Render Comprobante Egreso Modificado

exports.modifyEgresoPdf = (req, res) => {
    let _this = res; //creado para usarlo en el render dentro de la funcion "crear PDF", esto para renderizar la confirmacion luego de modificado el PDF
    const source1 = axios.get('http://localhost:3000/api/egreso',{params:{id:req.query.id}})
    const source2 = axios.get('http://localhost:3000/api/junta');

    axios.all([source1,source2])
    .then(axios.spread((...userdata) => {
        let data_egreso = userdata[0].data;
        let data_junta = userdata[1].data.filter(item => item.año == parseInt(data_egreso.fecharegistro.substring(6,10)))[0];

        // Si se crea algun registro en un año posterior en el cual la junta no se ha definido y/o registrado en el sistema, dejar el nombre de tesorería en blanco ""
        data_junta == undefined? data_junta = {tesoreria: ''} : data_junta = data_junta;

        const html = fs.readFileSync(path.join(__dirname, '../../views/_pdf_egreso.html'), 'utf-8');
        const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
        let mes_periodo = parseInt(data_egreso.periodo.substring(5,7));
        let mes_registro = parseInt(data_egreso.fecharegistro.substring(3,5));


        const data_e = {
            estado: data_egreso.estado == 'Anulado'? 'ANULADO' : '',
            documento: data_egreso.documento.substring(1,8),
            proveedor: data_egreso.proveedor,
            monto: data_egreso.monto.toFixed(2),
            periodo: MESES[mes_periodo-1] + ' - ' + data_egreso.periodo.substring(0,4),
            detalle: data_egreso.detalle,
            nrcomprobante: data_egreso.nrcomprobante,
            centrocosto: data_egreso.centrocosto,
            cuenta: data_egreso.cuenta,
            fecharegistro: data_egreso.fecharegistro.substring(0,2) + ' de ' + MESES[mes_registro-1] + ' del ' + data_egreso.fecharegistro.substring(6,10)
        };

        const data_j = {
            tesoreria: data_junta.tesoreria
        };

        const origin_root = './' + __dirname.split(path.sep).slice(-3,-1)[0];
        const path_root = `/docs/Egresos/${data_egreso.periodo.substring(0,4)}/${data_egreso.periodo.substring(5,7)}.${MESES[mes_periodo-1]}/${data_egreso.centrocosto}/`;
        const filename = `${data_egreso.proveedor.replace("/","-")}_${data_egreso.periodo.substring(0,4)}_${data_egreso.periodo.substring(5,7)}_N${data_egreso.documento.substring(1,8)}.pdf`;
        const document = {
            html: html,
            data: {
                egreso: data_e,
                junta: data_j
            },
            path: origin_root + path_root + filename
        };

        pdf.create(document, options_e)
            .then(res => {
                // console.log(res);
                const filepath = '.' + path_root + filename; //ruta para redireccionar al PDF y verlo en el navegador

                _this.render('5_4_comprobante_egreso_modificado', {
                    path: filepath
                });
            }).catch(error => {
                console.log(error);
            });
    }))
    .catch(err => {
        res.send(err);
    })
};
