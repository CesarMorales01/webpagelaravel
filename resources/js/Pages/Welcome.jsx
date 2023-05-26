import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MyCarousel from './UIGeneral/MyCarousel';
import React, { useState, useEffect } from 'react'
import GlobalFunctions from './services/GlobalFunctions';
import PojoProducto from './services/PojoProductos';
import SuggestedProducts from './UIGeneral/SuggestedProducts';
import Contact from './Contact/Contact';

export default function Welcome(params) {
    console.log(params)
    const glob = new GlobalFunctions()
    const [closeBtn, setCloseBtn] = useState(glob.getCookie('closeBtn'))

    useEffect(() => {
        checkCloseBtn()
        validarRedireccion()
    }, [])

    function validarRedireccion() {
        if (params.auth) {
            var variable = parseInt(glob.getCookie('productForCar'));
            console.log(variable)
            if (isNaN(variable)) {
                console.log("si")
            } else {
                window.location.href = params.globalVars.myUrl + 'product/' + glob.getCookie('productForCar')
                glob.setCookie('productForCar', '', -1)
            }
        }
    }

    function checkCloseBtn() {
        if (closeBtn == null || closeBtn == '') {
            setCloseBtn(0)
        }
        if (closeBtn >= 4) {
            setTimeout(() => {
                closeWhats()
            }, 4000);
        }
    }

    function activarHover(e) {
        document.getElementById(e + "divCategorias").style.boxShadow = '0px 15px 26px rgba(0, 0, 0, 0.50)'
        document.getElementById(e + "divCategorias").style['-webkit-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-moz-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-o-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.transition = 'all 0.1s ease-in'
        document.getElementById(e + "divCategorias").style.marginTop = '10px'
    }

    function desactivarHover(e) {
        document.getElementById(e + "divCategorias").style.boxShadow = '0px 0px 0px rgba(0, 0, 0, 0.50)'
        document.getElementById(e + "divCategorias").style['-webkit-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-moz-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style['-o-transition'] = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.transition = 'all 0.2s ease-in'
        document.getElementById(e + "divCategorias").style.marginTop = '0px'
    }

    function closeWhats() {
        document.getElementById("divWhats").style.display = "none"
        document.getElementById("divFb").style.display = "none"
        let sumar = parseInt(closeBtn) + 1
        glob.setCookie('closeBtn', sumar, 3600 * 60 * 24)
    }

    function goFb() {
        window.open(params.info.linkfb, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    function goWhats() {
        let href = "https://api.whatsapp.com/send?phone=057" + params.info.telefonos[0].telefono + "&text=Hola! He visitado tu página y me gustaria preguntar algo!";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }

    // Creación de arrays para mostrar resumen de productos por categorias
    let matrix = []
    let countCates = params.categorias.length
    for (let i = 0; i < countCates; i++) {
        let array = []
        for (let x = 0; x < params.productos.length; x++) {
            if (params.categorias[i].nombre == params.productos[x].categoria) {
                let pojo = new PojoProducto(params.productos[x].nombre, params.productos[x].codigo)
                pojo.setDescripcion(params.productos[x].descripcion)
                pojo.setImagen(params.productos[x].imagen.nombre_imagen)
                // darle formato al precio
                let precio_format = new Intl.NumberFormat("de-DE").format(params.productos[x].valor)
                pojo.setPrecio("$ " + precio_format)
                pojo.setRef(params.productos[x].id)
                array.push(pojo)
            }
        }
        let array1 = array.sort(() => Math.random() - 0.5)
        let array2 = []
        let nums = 0
        if (array1.length <= 12) {
            nums = array1.length
        } else {
            nums = 12
        }
        for (let r = 0; r < nums; r++) {
            array2.push(array1[r])
        }
        matrix[i] = array2
    }

    return (
        <>
            <Head title="Welcome" />
            <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} >
                <MyCarousel promos={params.promos} globalVars={params.globalVars}></MyCarousel>
                {/*Cards categorias*/}
                <br></br>
                <div className="container">
                    <h1 style={{ fontSize: '1.4em', padding: '0.5em' }} className='tituloCategorias'>Categorias</h1>
                </div>
                <div style={{ marginTop: '0.2em' }} className="container">
                    <div className="row">
                        {params.categorias.map((item, index) => {
                            return (
                                <div style={{ marginTop: '1em' }} key={index} className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                    <div id={index + "divCategorias"} onTouchEnd={() => desactivarHover(index)} onTouchStart={() => activarHover(index)} className="card border border card-flyer pointer">
                                        <h1 style={{ marginTop: 6, fontSize: '1.4em' }} className="card-title generalFontStyle">
                                            {item.nombre}
                                        </h1>
                                        <img className="card-img-top img-fluid" src={params.globalVars.urlRoot + item.imagen} alt="productos genial app" />
                                    </div>
                                </div>
                            )
                        })}
                        <br />
                    </div>
                    {/*Botones flotantes*/}
                    <div id='divFb' style={{ display: 'scroll', position: "fixed", bottom: '2%', left: '10%', zIndex: 1, cursor: 'pointer' }}>
                        <a onClick={closeWhats}><i className="fas fa-window-close"></i></a>
                        <h5 onClick={goFb}>Síguenos!</h5>
                        <img alt="" onClick={goFb} width="50" height="50" src={params.globalVars.urlRoot + '/Imagenes_config/btn_facebook.jpg'}></img>
                    </div>
                    <div id='divWhats' style={{ display: 'scroll', position: "fixed", bottom: '2%', right: '10%', zIndex: 1, cursor: 'pointer' }} >
                        <a onClick={closeWhats} ><i className="fas fa-window-close"></i></a>
                        <h5 onClick={goWhats} >Escribénos!</h5>
                        <img alt='' onClick={goWhats} src={params.globalVars.urlRoot + '/Imagenes_config/whatsApp_btn.png'}></img>
                    </div>
                    <div>
                        {params.categorias.map((it, index) => {
                            return (
                                <SuggestedProducts key={it.id} categoria={it.nombre} productos={matrix[index]} url={params.globalVars.urlRoot} />
                            )
                        })}
                    </div>
                    <Contact url={params.globalVars.urlRoot} datos={params.info}></Contact>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
