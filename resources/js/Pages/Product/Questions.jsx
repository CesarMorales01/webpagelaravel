import React from 'react'
import { useState, useEffect } from 'react';
import GlobalFunctions from '../services/GlobalFunctions';


const Questions = (params) => {
    const glob = new GlobalFunctions()
    const [mensaje, setMensaje] = useState('')
    const [preguntas, setPreguntas] = useState([])
    console.log(params)
    useEffect(() => {

    }, [preguntas])



    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=057" + params.tel + "&text=";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function preguntar_sobre(msje) {
        setMensaje(msje)
        document.getElementById("tv_preguntar").style.backgroundColor = "#f0e094";
        document.getElementById("btnPreguntar").style.backgroundColor = "green";
    }

    function check_pregunta() {
        if (glob.getCookie('correo') == 'Ingresar' || glob.getCookie('correo') == '') {
            document.getElementById('botonDialogoEliminar').click()
        } else {
            if (mensaje == '') {
                alert("Escribe una pregunta!")
            } else {
                fetchRegistrarPregunta()
            }
        }
    }

    function fetchRegistrarPregunta() {
        document.getElementById('btnPreguntar').style.display = 'none'
        document.getElementById('botonLoading').style.display = 'inline'
        const datos = {
            fecha: glob.getFecha(),
            cliente: glob.getCookie('correo'),
            producto: params.producto,
            pregunta: mensaje
        }
        const url = glob.URL_SERV + 'getPreguntas.php?modo=makeQuestion'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                return response.json()
            }).then((json) => {
                recargarPreguntas()
            })
    }

    function recargarPreguntas() {
        const array = []
        setPreguntas(array)
        document.getElementById('btnPreguntar').style.display = 'inline'
        document.getElementById('botonLoading').style.display = 'none'
    }

    function functionSetMensaje(event) {
        setMensaje(event.target.value)
    }

    function procesarLoginFromQuestion() {
        document.getElementById('botonDialogoEliminar').click()
        document.getElementById('spanIrLogin').click()
    }

    return (
        <div className='container'>
            <div className="row cursorPointer textAlignCenter" >
                <div style={{ margin: '2px' }} className="col-sm-4 col-md-3 col-lg-2">
                   <h2 className='fontSizePreciosSuggested'>Pregunta sobre este producto</h2>
                </div>
                <div style={{ margin: '2px' }} className="col-sm-3 col-md-3 col-lg-2">
                    <a onClick={() => preguntar_sobre('Tiene costo el envio?')} className="btn btn-primary fontSizeQuestions">Tiene costo el envio?</a>
                </div>
                <div style={{ margin: '2px' }} className="col-sm-4 col-md-3 col-lg-2">
                    <a onClick={() => preguntar_sobre('Tiene garantía?')} className="btn btn-primary fontSizeQuestions">Tiene garantía?</a>
                </div>
                <div style={{ margin: '2px' }} className="col-sm-6 col-md-3 col-lg-3">
                    <a onClick={() => preguntar_sobre('Puedo recoger el producto?')} className="btn btn-primary fontSizeQuestions">Puedo recoger el producto?</a>
                </div>
                <div onClick={goWhats} style={{ margin: '2px' }} className="col-sm-6 col-md-2 col-lg-2">
                    <a ><img src={params.globalVars.urlRoot + 'Imagenes_config/whatsApp_btn.png'} /></a>
                </div>
                <br /><br /><br />
            </div>
            <div className="row" >
                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                    <textarea onChange={functionSetMensaje} id='tv_preguntar' style={{ backgroundColor: '#D5DBDB', padding: '0.2em' }} className="form-control-plaintext" rows="2" cols="150" placeholder="Escribe una pregunta..." value={mensaje}></textarea>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                    <button id='btnPreguntar' type="button" onClick={check_pregunta} style={{ margin: '2px' }} className="btn btn-outline-success btn-lg fontSizeQuestions" >Preguntar</button>
                    <button id='botonLoading' style={{ display: 'none', color: 'black' }} className="btn btn-outline-success" type="button" disabled>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Loading...
                    </button>
                </div>
            </div>
            <br />
            <div id="div_contenedor_preguntas" className="container border">
                <h4 style={{ marginBottom: '0.4em' }}>{preguntas.length == 0 ? '' : 'Preguntas realizadas:'}</h4>
                {preguntas.map((item, index) => {
                    return (
                        <div className='container' key={index}>
                            <h5 style={{ marginTop: '0.2em' }}><li>{item.descripcion_credito}</li></h5>
                            <p>{item.comentarios == '' ? 'En breve unos de nuestros asesores dará respuesta...' : item.comentarios}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Questions