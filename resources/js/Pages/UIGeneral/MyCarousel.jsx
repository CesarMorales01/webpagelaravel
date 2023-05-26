import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import '../../../css/general.css'
import { useState, useEffect } from 'react';

const MyCarousel = (params) => {
    const [thisWidth, setthisWidth] = useState('')

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

    function loadingImgCarousel() {
        document.getElementById('spanCargandoCarousel').style.display = 'none'
    }

    function goProduct(id){
      window.location= params.globalVars.thisUrl+"product/"+id
    }

    return (
        <div>
            <div style={{ marginTop: 3 }} className='container'>
                <span id='spanCargandoCarousel' className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <Carousel variant="dark" indicators={false}>
                    {
                        params.promos.map((item, index) => {
                            return (
                                <Carousel.Item onClick={()=>goProduct(item.ref_producto)} className='textAlignCenter' key={index}>
                                    <img style={{ backgroundColor: 'red' }} onLoad={loadingImgCarousel} id={item.referencia} className={'centerImgCarousel cursorPointer ' + thisWidth}
                                        src={params.globalVars.urlRoot + item.imagen}
                                        alt=""
                                    />
                                    <h3 className='textAlignCenter fontSizeNormal'>{item.descripcion}</h3>
                                </Carousel.Item>
                            )
                        })
                    }
                </Carousel>
            </div>
        </div>
    )
}

export default MyCarousel