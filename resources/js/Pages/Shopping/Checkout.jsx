import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';
import EmptyNavBar from '@/Layouts/EmptyNavBar';
import { Head } from '@inertiajs/react'

const CheckOut = (params) => {

    const glob = new GlobalFunctions()
    const [datosCliente, setDatosCliente] = useState(params.datosCliente)
    const [totales, setTotales] = useState(params.totales)
    const [comentario, setComentario] = useState('')
    const [stringDireccion, setStringDireccion] = useState('')

    useEffect(() => {
        if (params.totales.subtotal > 0) {
            setTotales(params.totales)
        }
    })

    useEffect(() => {
        cargarBotonPago()
        getStringDireccion()
    }, [])


    function fetchEstadopago(ref) {
        const url = glob.URL_SERV + 'get_compras.php?modo=validarPago&ref=' + ref
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                if (json == 'APPROVED') {
                    if (document.getElementById('inputGoMisCompras') != null) {
                        document.getElementById('inputGoMisCompras').click()
                    }
                } else {
                    if (document.getElementById('botonDialogoEliminar') != null) {
                        document.getElementById('botonDialogoEliminar').click()
                    }
                }
            })
    }

    function fetchRefWompi() {
        const url = glob.URL_SERV + 'get_compras.php?modo=refWompi&cliente=' + datosCliente.cedula + '&totalVenta=' + totales.totalConMedioDePago + '&fecha=' + glob.getFecha() + '&estado=ventaCasaBonitaWeb'
        fetch(url)
            .then((response) => {
                return response.json()
            }).then((json) => {
                document.getElementById('inputRefWompi').value = json[0].id
                registrarCompra(json[0].id)
                document.getElementById('formWompi').submit()
                // cookie para validar estado del pago despues de regreso de wompi
                glob.setCookie('refWompi', json[0].id, glob.setExpires('1'))
            })
    }

    function cargarBotonPago() {
        if (params.modoPago == 'contraentrega') {
            document.getElementById('imgPago').src = params.globalVars.urlRoot + "Imagenes_config/ico_contraEntrega.png"
        } else {
            document.getElementById('imgPago').src = params.globalVars.urlRoot + "Imagenes_config/wompi_btn.png"
        }
    }

    function goProfile() {
        const exp = 3600 * 24 * 365
        glob.setCookie('comeBackCarrito', true, exp)
        window.location.href = params.globalVars.thisUrl + "profile/" + params.auth.email
    }

    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=057" + params.info.telefonos[0].telefono + "&text=Hola! Tengo un problema con mi carrito de compras!";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function loadingOn() {
        document.getElementById('btnCheckOut').style.display = 'none'
        document.getElementById('btnCheckOutLoading').style.display = ''
    }

    function loadingOff() {
        document.getElementById('btnCheckOut').style.display = ''
        document.getElementById('btnCheckOutLoading').style.display = 'none'
    }

    function validarModoPago() {
        if (params.modoPago == 'contraentrega') {
            registrarCompra('')
        } else {
            document.getElementById('btnPagarValidarPago').style.display = 'inline'
            //iniciarTemporizador()
            //fetchRefWompi()
        }
    }

    function iniciarTemporizador() {
        let i = 0
        const myInterval = setInterval(() => {
            let num = parseInt(60 - i)
            document.getElementById('spanValidarPago').innerText = "Validando pago en ... " + num
            i++
            if (i == 60) {
                if (document.getElementById('inputGoMisCompras') != null) {
                    validarEstadoPago()
                }
                clearInterval(myInterval)
            }
        }, 1000)
    }

    function registrarCompra(ref) {
        loadingOn()
        const url = params.globalVars.thisUrl + "shopping/registrar/compra?_token=" + params.token
        let infoPago = {
            fecha: glob.getFecha(),
            totales: params.totales,
            formaPago: params.modoPago,
            cliente: params.datosCliente,
            productos: params.productos,
            comentarios: comentario,
            referenciaWompi: ref
        }
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(infoPago),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            return response.json()
        }).then((json) => {
            loadingOff()
            if (json > 0) {
                window.location.href = params.globalVars.thisUrl + 'shopping/create'
            } else {
                alert('Ha ocurrido un error! Por favor comunicate con nosotros!')
            }
        })
    }

    function changeComentario(e) {
        setComentario(e.target.value)
    }

    function getStringDireccion() {
        let infoDir = ''
        if (params.datosCliente != null) {
            infoDir = datosCliente.direccion + ". " + datosCliente.info_direccion + ". " + getNombreCiudad().ciudad + ". " + getNombreCiudad().depto
        }
        setStringDireccion(infoDir)
    }

    function getNombreCiudad() {
        let nombres = {
            'ciudad': '',
            'depto': ''
        }
        let codDepto = 0
        for (let i = 0; i < params.municipios.length; i++) {
            if (params.municipios[i].id == datosCliente.ciudad) {
                nombres.ciudad = params.municipios[i].nombre
                codDepto = params.municipios[i].departamento_id
            }
        }
        for (let i = 0; i < params.deptos.length; i++) {
            if (params.deptos[i].id == codDepto) {
                nombres.depto = params.deptos[i].nombre
            }
        }
        return nombres
    }

    return (
        <>
            <Head title="Revisar compra" />
            <EmptyNavBar info={params.info} globalVars={params.globalVars}>
                <div style={{ marginTop: '1em' }} className="container">
                    <div className="row justify-content-around">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12" >
                            <h5 style={{ fontSize: '1.4em', fontWeight: 'bold', textAlign: 'center', marginTop: '0.4em', marginBottom: '0.4em' }} >Tu compra será entrega en:</h5>
                            <p style={{ textAlign: 'justify', color: 'black' }}>Dirección de domicilio</p>
                            <textarea name="direccion" id="direccion" readOnly rows="2" value={stringDireccion} className="form-control"></textarea>
                            <br />
                            <h5>A nombre de:</h5>
                            <input type="text" name="nombre" readOnly className="form-control" value={datosCliente.nombre + " " + datosCliente.apellidos} id="nombre" />
                            <br />
                            <p id="alert_cambio" style={{ textAlign: 'justify', color: 'black' }}>Número de cédula</p>
                            <input type="text" readOnly name="cedula" className="form-control" value={datosCliente.cedula} id="input_cedula" />
                            <br />
                            <h5 >Y tus números telefónicos son:</h5>
                            <ul style={{ marginTop: '0.2em' }} className="list-group">
                                {datosCliente.telefonos.map((item, index) => {
                                    return (
                                        <div key={index} className="col-4">
                                            <li style={{ padding: '0.2em' }} className="list-group-item">{item}</li>
                                        </div>
                                    )
                                })}
                            </ul>
                            <div style={{ textAlign: 'center', marginTop: '1em' }} className="container">
                                <button onClick={goProfile} style={{ backgroundColor: '#f0e094' }} id="btn_modificar" className="btn btn-outline-success my-2 my-sm-0" type="button" >Modificar datos personales<i style={{ marginLeft: '0.5em' }} className="fas fa-edit"></i></button>
                            </div>
                            <br />
                            <textarea onChange={changeComentario} placeholder="Haz nos saber si tienes algun comentario, duda o sugerencia sobre tu compra." rows="2" className="form-control"></textarea>
                            <br />
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12 border border-success">
                            <h5>Resumen compra:</h5>
                            {params.productos.map((item, index) => {
                                const img = params.globalVars.urlRoot + 'Imagenes_productos/' + item.imagen;
                                const precio = parseInt(item.valor) * item.cantidad
                                let precio_format = new Intl.NumberFormat("de-DE").format(precio)
                                return (
                                    <div key={index}>
                                        <div style={{ padding: '0.5vh' }} className="row align-items-center">
                                            {/*div img*/}
                                            <div className="col-2"  >
                                                <img className="img-fluid" style={{ height: '4.5em', width: '4em' }} src={img} />
                                            </div>
                                            {/*div cant*/}
                                            <div className="col-1"  >
                                                <h6>{item.cantidad}</h6>
                                            </div>
                                            {/*div titulo*/}
                                            <div className="col-6"  >
                                                <h6 style={{ fontSize: '0.8em' }}>{item.producto}</h6>
                                            </div>
                                            {/*div precio*/}
                                            <div className="col-3" >
                                                <h6>${precio_format}</h6>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                            <div className="row justify-content-around">
                                <div className="col-lg-6" >
                                    <h6 style={{ textAlign: 'center' }}>Subtotal</h6>
                                </div>
                                <div className="col-lg-6" >
                                    <h6 id="tv_subtotal" style={{ textAlign: 'center', color: 'green' }}>$ {totales.formatSubtotal}</h6>
                                </div>
                                <div className="col-lg-6" >
                                    <h6 style={{ textAlign: 'center' }}>Envio</h6>
                                </div>
                                <div className="col-lg-6" >
                                    <h6 id="tv_costo_envio" style={{ textAlign: 'center' }}>$ {totales.formatEnvio}</h6>
                                </div>
                                <div className="col-lg-6" >
                                    <h6 style={{ textAlign: 'center' }}>Pago electrónico</h6>
                                </div>
                                <div className="col-lg-6" >
                                    <h6 id="tv_costo_pago" style={{ textAlign: 'center' }}>$ {totales.formatMedioPago}</h6>
                                </div>
                                <br />
                                <div className="col-lg-12" >
                                    <hr style={{ height: '2px', borderWidth: '0', color: 'gray', backgroundColor: 'gray' }}></hr>
                                </div>
                                <div className="col-lg-6" >
                                    <h5 style={{ textAlign: 'center' }}>Total</h5>
                                </div>
                                <div className="col-lg-6" >
                                    <h5 id="tv_costo_total" style={{ textAlign: 'center', color: 'green' }}>$ {totales.formatTotalConMedioPago}</h5>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }} className="container">
                            <br /><br />
                            <div className="container card" id="div_pago">
                                <br />
                                <div className={params.thisWidth > 400 ? 'container' : 'justify-content-between'}>
                                    <div className="col-lg-12" >
                                        <img className='centerImgCarousel' id='imgPago' style={{ height: '4em', width: '8em' }} src='' alt='' />
                                    </div>
                                    <br />
                                    <button onClick={validarModoPago} id="btnCheckOut" style={{ backgroundColor: params.modoPago == 'contraentrega' ? 'green' : '#094293', color: 'white' }} className="btn btn-outline-success my-2 my-sm-0" type="button">
                                        {params.modoPago == 'contraentrega' ? 'Confirmar pago contraentrega' : 'Ir a pagos wompi'}
                                    </button>
                                    <button id='btnCheckOutLoading' style={{ display: 'none', backgroundColor: 'gray' }} className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button>
                                </div>
                                <br />
                            </div>
                            {/*formu wompi*/}
                            <form id='formWompi' action="https://checkout.wompi.co/p/" method="GET">
                                <input type="hidden" name="public-key" value="pub_prod_mm5Qq0EJtZhzNzjV4Vm6fLQx6aHhCbjS" />
                                <input type="hidden" name="currency" value="COP" />
                                <input type="hidden" name="amount-in-cents" value={totales.totalConMedioDePago + "00"} />
                                <input type="hidden" id='inputRefWompi' name="reference" value="" />
                                <input type="hidden" name="redirect-url" value={'' + "/redirectWompi.php"} />
                                <input type="hidden" name="shipping-address:address-line-1" value='Calle 100 20-30' />
                                <input type="hidden" name="shipping-address:country" value="CO" />
                                <input type="hidden" name="shipping-address:phone-number" value={datosCliente.cedula} />
                                <input type="hidden" name="shipping-address:city" value={params.auth.email} />
                                <input type="hidden" name="shipping-address:region" value='Santander' />
                            </form>
                            <br />
                            <div onClick={goWhats} className="container">
                                <div className="row justify-content-center">
                                    <div className="col-5">
                                        <a className="btn btn-primary">Dudas? Preguntanos!</a>
                                    </div>
                                    <div className="col-5">
                                        <a style={{ cursor: 'pointer' }} ><img style={{ height: '3em', width: '3em' }} src={params.globalVars.urlRoot + '/Imagenes_config/whatsapp1.png'} /></a>
                                    </div>
                                </div>
                            </div>
                            <br /><br />
                            <button id='btnPagarValidarPago' style={{ display: 'none', backgroundColor: 'gray' }} className="btn btn-primary" type="button" disabled>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                <span id='spanValidarPago'>Validando pago en ...</span>
                            </button>
                            <br />
                        </div>
                    </div>

                </div>
            </EmptyNavBar>

        </>
    )


}

export default CheckOut