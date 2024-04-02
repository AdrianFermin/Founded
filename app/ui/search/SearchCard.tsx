import React from 'react';
import { Card, Carousel } from 'antd';
import { Empresa } from '@/app/lib/types';
import {Image, Rate} from 'antd';
import { FaMapLocationDot } from "react-icons/fa6";


const SearchCard = ({empresa, location, setter, imagenes} : {empresa:Empresa, location:string, setter: any, imagenes: any[]}) => {


    const desc = ['Pasable', 'Normal', 'Bueno', 'Muy bueno', 'Excelente'];

    return (
        <>
            <Card
            hoverable
            style={{ width: 350 }}
            cover={<Carousel autoplay autoplaySpeed={3000}>
                {imagenes.map((imagen) => {
                    if(imagen.empresa == empresa.id){
                        return (
                            <div key={imagen.id}>
                                <Image width={350.5} height={230} 
                                src={imagen.url}/>
                            </div>
                        )
                    }
                })}
            </Carousel>}
            >
                <div onClick={() => setter(empresa)}>
                    <h2 className='text-2xl font-bold'>{empresa.name}</h2>
                    <p className="text-lg">{empresa.description.length <= 20 ? empresa.description : empresa.description.substring(0, 20).concat("...")}</p>
                    <div className="mt-2"><Rate tooltips={desc} style={{fontSize: 28}} allowHalf disabled defaultValue={empresa.rate} /></div>
                    <div className='flex text-xs mt-3 text-gray-400'>
                        <FaMapLocationDot className='mt-0.5 me-1'/>
                        <p>{`${location}, Republica Domminicana`}</p>
                    </div>
                </div>
            </Card>
        </>
    )
}
  


export default SearchCard ;