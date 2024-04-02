'use client'
import { useRouter } from "next/navigation";
import { Empresa } from "../lib/types";
import { Card, Rate, Image, Carousel } from 'antd';


const RecomendationsCard = ({empresa, imagenes} : {empresa: Empresa, imagenes: any[]}) => {

    const { replace } = useRouter();

    const handleClick = () => {
        replace(`/search?query=${empresa.name}`)
    }

    return(
        <div className="mb-10">
            <Card
            hoverable
            style={{ width: 300}}
            cover={<Carousel autoplay autoplaySpeed={3000}>
            {imagenes.map((imagen) => {
                if(imagen.empresa == empresa.id){
                    return (
                        <div key={imagen.id}>
                            <Image width={300} height={180} 
                            src={imagen.url}/>
                        </div>
                    )
                }
            })}
        </Carousel>}
            >
            <div onClick={handleClick}>
                <h4 className="font-semibold text-xl">{empresa.name}</h4>
                <p className="text-lg">{empresa.description.length <= 20 ? empresa.description : empresa.description.substring(0, 20).concat("...")}</p>
                <div className="mt-3"><Rate allowHalf disabled defaultValue={empresa.rate} /></div>
            </div>
            </Card>
        </div>
    )
}

export default RecomendationsCard