import { useState, useEffect } from 'react';
import SuggestedProducts from '../UIGeneral/SuggestedProducts';
import Contact from '../Contact/Contact';
import GlobalFunctions from '../services/GlobalFunctions';
import Carousel from 'react-bootstrap/Carousel'
import { RWebShare } from 'react-web-share'
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PojoProducto from '../services/PojoProductos'
import '../../../css/general.css'
import PrimaryButton from '@/Components/PrimaryButton';
import Questions from './Questions'
import Swal from 'sweetalert2';

const Product = (params) => {
  console.log(params)
  const glob = new GlobalFunctions()
  const [producto, setProducto] = useState(params.producto)
  const [cantidad, setCantidad] = useState(1)
  const [precioAntes, setPrecioAntes] = useState(true)
  const [productoSugeridos, setProductosSugeridos] = useState([])
  const [index, setIndex] = useState(0)
  const [descripcion, setDescripcion] = useState([])
  const [thisWidth, setthisWidth] = useState('')

  useEffect(() => {
    procesarDatos()
    functionSetProductosSugeridos()
  }, [])

  useEffect(() => {
    setthisWidth(setDimensionPantalla())
  }, [])

  function setDimensionPantalla() {
    let widthDiv
    if (window.screen.width < 600) {
      widthDiv = 'imgCarouselSm'
    } else {
      widthDiv = 'imgCarouselBig'
    }
    return widthDiv
  }
 
  function sweetAlert(mensaje) {
    Swal.fire({
      title: mensaje,
      icon: 'warning',
      showCancelButton: false,
      showConfirmButton: false,
      timer: 1500,
    })
  }


  function procesarDatos() {
    if (descripcion.length == 0) {
      setDescripcion(params.producto.descripcion.split("."))
    }
    //setTimeout(setPromoPrecio, 100)
  }

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
    setBordeDiv(selectedIndex)
  }

  function setBordeDiv(index) {
    var div_min = document.getElementById("div_miniaturas");
    for (var x = 0; x < div_min.childNodes.length; x++) {
      if (div_min.childNodes[x].nodeType == Node.ELEMENT_NODE) {
        div_min.childNodes[x].style.borderLeft = "";
      }
    }
    document.getElementById('divMin' + index).style.borderLeft = "thick solid brown";
  }


  function sendClickProducto(event) {
    let id = event.currentTarget.id
    const urlProducto = params.datos[0].otros1 + "product/" + id
    window.location.href = urlProducto
  }

  function setPromoPrecio() {
    functionSetPrecioAntes()
    functionSetDescripcion()
  }

  function functionSetProductosSugeridos() {
    if (productoSugeridos.length == 0) {
      // Creación de arrays para mostrar resumen de productos por categorias
      let array = []
      for (let x = 0; x < params.productos.length; x++) {
        if (producto.categoria == params.productos[x].categoria) {
          let pojo = new PojoProducto(params.productos[x].nombre, params.productos[x].codigo)
          pojo.setImagen(params.productos[x].imagen.nombre_imagen)
          // darle formato al precio
          let precio_format = new Intl.NumberFormat("de-DE").format(params.productos[x].precio)
          pojo.setPrecio("$ " + precio_format)
          pojo.setRef(params.productos[x].referencia)
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
      setProductosSugeridos(array2)
    }
  }

  function functionSetPrecioAntes() {
    let num = Math.random()
    let item = document.getElementById("tv_precio_antes")
    if (num > 0.8 && precioAntes && item != null && pojo.precio != '0') {
      let precio_ant = (parseInt(producto[0].precio) * 0.2) + parseInt(producto[0].precio);
      var precio_format = new Intl.NumberFormat("de-DE").format(precio_ant);
      document.getElementById("tv_precio_antes").innerText = "Antes: $ " + precio_format;
      document.getElementById("tv_precio").innerText = "Hoy: " + pojo.precio
    }
    setPrecioAntes(false)
  }

  function cambiarImagen(index) {
    setIndex(index)
    setBordeDiv(index)
  }

  function set_full_screen(id) {
    var imagen = document.getElementById('imgMain' + id)
    getFullscreen(imagen);
  }

  function getFullscreen(element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function menosCant() {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  function masCant() {
    if (cantidad < 6) {
      setCantidad(cantidad + 1)
    }
  }

  function checkUsuario() {
    if (params.auth) {
      guardarEnCarrito()
    } else {
      // guardo una cookie para cuando no hay sesion iniciada, y una vez hecha retornar al product
      glob.setCookie('productForCar', producto.id, 3600)
      sweetAlert("Debes identificarte para agregar al carrito!")
      setTimeout(() => {
        window.location.href= params.globalVars.thisUrl+'log'
      }, 1500);
      
    }
  }

  function guardarEnCarrito() {
    document.getElementById('btnComprar').style.display = 'none'
    document.getElementById('btnLoading').style.display = 'inline'
    const fecha = glob.getFecha()
    let objeto = {
      "cliente": glob.getCookie('correo'),
      "cod": producto[0].codigo,
      "producto": producto[0].nombre,
      "imagen": pojo.listaImagenes[0].nombre,
      "valor": producto[0].precio,
      "cantidad": cantidad,
      "fecha": fecha
    };
    validarInsertUpdate(objeto)
  }

  function compararItems(json, datos) {
    let cant = 0
    json.map((item) => {
      if (item.codigo == datos.cod) {
        cant = item.cantidad
      }
    })
    if (cant > 0) {
      actualizarCarrito(datos, cant)
    } else {
      insertarCarrito(datos)
    }
  }

  function actualizarCarrito(datos, cant) {
    let objeto = {
      "cod": datos.cod,
      "cliente": glob.getCookie('correo'),
      "cantidad": parseInt(cant) + 1
    };
    const url = glob.URL_SERV + 'getCarrito.php?modo=actualizarCantidad'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(objeto),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        return response.json()
      }).then((json) => {
        validarInsercion(json)
      })
  }

  function insertarCarrito(datos) {
    const url = glob.URL_SERV + 'getCarrito.php?modo=insert';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(datos),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      validarInsercion(data)
    }).catch(function (error) {
      loadingOff()
    })
  }

  function validarInsertUpdate(datos) {
    const url = glob.URL_SERV + 'getCarrito.php?modo=getCarrito&id=' + glob.getCookie('correo')
    fetch(url)
      .then((response) => {
        return response.json()
      }).then((json) => {
        compararItems(json, datos)
      })
  }

  function validarInsercion(data) {
    loadingOff()
    if (data[0].nombre == "Registro") {
      document.getElementById('inputGoCarrito').click()
    } else {
      alert("Error al ingresar en carrito. Cuéntanoslo por alguno de nuestros medios de comunicación!")
    }
  }

  function loadingOff() {
    document.getElementById('btnComprar').style.display = 'inline'
    document.getElementById('btnLoading').style.display = 'none'
  }

  function loadingImgMain() {
    document.getElementById('spanCargandoImagen').style.display = 'none'
  }

  function procesarPreguntaLogin() {
    // guardo una cookie para cuando no hay sesion iniciada, y una vez hecha retornar al product
    if (glob.getCookie('correo') === '') {
      glob.setCookie('productForCar', producto[0].codigo, 3600)
    } else {
      glob.setCookie('productForCar', producto[0].codigo, 0)
    }
    setLoginMessage('Debes identificarte para preguntar!')
    setTimeout(() => {
      document.getElementById('inputIrLogin').click()
    }, 200);

  }

  // Inicio class jsx
  return (
    <>
      <Head title="Welcome" />
      <AuthenticatedLayout user={params.auth} info={params.info} globalVars={params.globalVars} productos={params.productos} >
        <div id="div_producto_todo">
          {/*div contenedor producto: miniaturas, img main y comprar*/}
          <div className="row">
            <div className="row col-lg-2 col-md-2 col-sm-12 overflow-auto" style={{ height: '30em', marginLeft: '0.2em', display: window.screen.width < 600 ? 'none' : 'inline' }} id="div_miniaturas">
              {producto.imagen.map((item, index) => {
                return (
                  <div key={index} id={'divMin' + index} onClick={() => cambiarImagen(index)} className="col-sm-3 col-md-12" style={{ height: '4em', width: '7em', margin: '20px', cursor: 'pointer', marginLeft: '0.6em' }}>
                    <img className="img-fluid img-thumbnail" style={{ height: '80px', width: '100px' }} src={params.globalVars.urlRoot + '/Imagenes_productos/' + item.nombre_imagen} />
                    <br />
                  </div>
                )
              })}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 border" >
              <span id='spanCargandoImagen' className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <Carousel activeIndex={index} onSelect={handleSelect} variant="dark" indicators={false}>
                {
                  producto.imagen.map((item, index) => {
                    return (
                      <Carousel.Item className='textAlignCenter' key={index}>
                        <img id={'imgMain' + index} onClick={() => set_full_screen(index)} onLoad={loadingImgMain} className={'cursorPointer centerImgCarousel ' + thisWidth}
                          src={params.globalVars.urlRoot + "/Imagenes_productos/" + item.nombre_imagen}
                          alt=""
                        ></img>
                      </Carousel.Item>
                    )
                  })
                }
              </Carousel>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12">
              <div style={{ padding: '0.1em' }} className="card text-center card-flyer">
                <div>
                  <br />
                  <h1 id="titulo_producto" style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{producto.nombre}</h1>
                  <br />
                  <h3 id="tv_precio_antes" style={{ color: 'red', textDecoration: 'line-through' }} className="fontSizePreciosSuggested"></h3>
                  <h3 id="tv_precio" style={{ fontSize: '1.4em', fontWeight: 'bold' }}>{producto.cantidad == 0 ? '-' : '$ ' + glob.formatNumber(producto.valor)}</h3>
                  <br />
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-5 col-12">
                        <h6 >Cantidad</h6>
                      </div>
                      <div onClick={menosCant} className="col-sm-1 col-4 cursorPointer">
                        <i style={{ color: 'green' }} className="fas fa-minus"></i>
                      </div>
                      <div className="col-sm-4 col-4">
                        <span style={{ fontWeight: 'bold', fontSize: '1.3em' }}>{cantidad}</span>
                      </div>
                      <div onClick={masCant} className="col-sm-1 col-4 cursorPointer">
                        <i style={{ color: 'green', fontSize: '1.5em' }} className="fas fa-plus"></i>
                      </div>
                    </div>
                  </div>
                  <br />
                  <h3 className='fontSizePreciosSuggested'>Envio gratis en el área metrópolitana de Bucaramanga!</h3>
                  <p >(Compras superiores a $100.000)</p>
                  <br />
                  <h3 className='fontSizePreciosSuggested'>A otras ciudades del pais el valor del envio es de $25.000.</h3>
                  <br />
                  <h3 id="tv_llega" ></h3>
                  {/*formulario producto */}
                  <PrimaryButton id='btnComprar' type='button' onClick={checkUsuario} style={{ backgroundColor: producto.cantidad == 0 ? 'gray' : 'greeen' }}
                    className="btn btn-success" disabled={producto.cantidad == 0 ? true : false}>{producto.cantidad == 0 ? 'Producto agotado' : 'Comprar'}
                  </PrimaryButton>
                  <button id='btnLoading' style={{ display: 'none', backgroundColor: 'green' }} className="btn btn-primary" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...
                  </button>
                  <div style={{ textAlign: 'right' }} className='container'>
                    <RWebShare
                      data={{
                        text: producto.nombre,
                        url: params.globalVars.myUrl + "product/" + producto.id,
                        title: producto.nombre
                      }}
                    >
                      <button className='btn btn-outline-primary btn-sm rouded'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
                          <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5z" />
                        </svg>
                      </button>
                    </RWebShare>
                  </div>
                  <br />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="container">
            <div className="card text-center card-flyer">
              <h1 style={{ fontSize: '1.4em', textAlign: 'center', marginBottom: '0.2em', marginTop: '0.2em' }} >Descripcion</h1>
              <div style={{ textAlign: 'justify', padding: '0.5em' }}>
                {descripcion.map((item, index) => {
                  return (
                    <p key={index}>{item + ". "}</p>
                  )
                })}
              </div>
            </div>
            <br />
            <p><strong style={{ color: 'red' }}>*</strong>La disponibilidad, el precio y la cantidad de unidades de los productos esta sujeta a las unidades disponibles en inventario.
              Tu Casa Bonita no se hace responsable por el posible agotamiento de unidades.</p>
            <br />
          </div>
        </div>
        <Questions producto={producto.codigo} procesarPreguntaLogin={procesarPreguntaLogin} globalVars={params.globalVars}></Questions>
      </AuthenticatedLayout >
    </>
  )

}

export default Product