import React from 'react'

const SuggestedProducts = (params) => {

    function removeLoad(e){
       document.getElementById('load'+e).style.display='none'
    }

    function goProduct(e){
        window.location.href= params.globalVars.thisUrl+'product/'+e
    }

    return (
        <div className="container">
            <div style={{ margin: '0.2em' }} className="container tituloCategorias">
                <h5 style={{ fontSize: '1.4em', padding: '0.5em' }} className='textAlignCenter'>{params.categoria}</h5>
            </div>
            <div className="container">
                <div className="row">
                    {params.productos.map((item, index) => {
                        return (
                            <div style={{ marginTop: 2 }} key={index} id={item.codigo} onClick={()=>goProduct(item.codigo)} className="col-md-4 col-sm-6 col-6 card-flyer">
                                <div className="card cursorPointer">
                                    <h5 className='textAlignCenter generalFontStyle' >{item.nombre}</h5>
                                    <span style={{ marginLeft: '1em' }} id={'load'+item.codigo} className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <img onLoad={()=>removeLoad(item.codigo)} src={params.globalVars.urlRoot + '/Imagenes_productos/' + item.imagen} className="card-img-top" />
                                    <p style={{ color: item.precio == '$ 0' ? 'gray' : 'black' }} className="fontSizePreciosSuggested">
                                        {item.cantidad == '0' ? 'Agotado' : item.precio}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SuggestedProducts