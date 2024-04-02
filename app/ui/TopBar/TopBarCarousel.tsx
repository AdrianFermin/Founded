'use client'
import React from 'react';
import { Carousel } from 'antd';
import {Image} from 'antd';
import { useRouter } from 'next/navigation';

const contentStyle: React.CSSProperties = {
  height: '600px',
  color: '#fff',
  lineHeight: '600px',
  textAlign: 'center',
  background: '#364d79',
};

const TopBarCarousel = ({imagenes} : {imagenes:any[]}) => {

  const {replace} = useRouter();

  const portadaClick = (index: number) => {
    if(index == 0){
      replace('/search?query=Nailar%20Studio')
    } else if(index == 1){
      replace('/search?query=Stitches%20and%20Berries')
    } else if(index == 2){
      replace('/search?query=L.A%20Technology')
    }
  }

  return (
    <div>
      <Carousel className='z-0 fixed top-0 right-0' style={{width:1481}} dotPosition='right' autoplay autoplaySpeed={2000}>
        {imagenes.map((imagen, index) => {
          return(
            <div className='hover:cursor-pointer' key={imagen.id} onClick={() => portadaClick(index)}>
                <h3 style={contentStyle}><Image
                    preview={false}
                    width={1481}
                    height={600}
                    src={imagen.url}
                    alt=''
                    className='object-cover'
                  /></h3>
            </div>
          )
        })}
      </Carousel>
  </div>
  )
};

export default TopBarCarousel;