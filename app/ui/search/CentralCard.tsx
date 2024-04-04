'use client'

import { Empresa, Rating } from "@/app/lib/types"
import { Image, Carousel, Rate, Tag, Tooltip, message } from "antd"
import { FaMapLocationDot } from "react-icons/fa6";
import { FaStar, FaInstagramSquare, FaFacebookSquare, FaWhatsapp, FaPlusCircle, FaCommentSlash  } from "react-icons/fa";
import { MdLocalPhone } from "react-icons/md";
import { RenderIf } from "../view";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Modal, FloatingLabel, Textarea  } from 'flowbite-react';
import { showAlert } from "@/app/lib/functions";
import { createRating } from "@/app/lib/actions/empresa";
import { usePathname, useRouter } from "next/navigation";

const CentralCard = ({empresa, ratings, images} : {empresa: Empresa, ratings: Rating[], images:any[]}) => {

    const desc = ['Pasable', 'Normal', 'Bueno', 'Muy bueno', 'Excelente'];
    let localRatings:Rating[] = [];
    const productos = empresa.productos.split(',')
    const [openModal, setOpenModal] = useState(false);
    const [comment, setComment] = useState("");
    const [name, setName] = useState("");
    const [rate, setRate] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    const [messageApi, contextHolder] = message.useMessage();

    const [localImages, setImages] = useState<any[]>(images)

    const copyNumber = (text: string | undefined) => {
        navigator.clipboard.writeText(text || '').then(() => {
            messageApi.success('Texto copiado satisfactoriamente');
        })
    }

    const cancelComment = () => {
        setName("");
        setRate(0);
        setComment("")
        setOpenModal(false);
    }

    const sendComment = async() => {
        if(name.length < 8){
            showAlert({title: 'Nombre invalido', text: 'El nombre ingresado es muy corto', icon: 'error'});
        } else if(name.length > 45){
            showAlert({title: 'Nombre invalido', text: 'El nombre ingresado es muy largo', icon: 'error'});
        } else if(comment.length < 20){
            showAlert({title: 'Comentario invalido', text: 'El comentario ingresado es muy corto', icon: 'error'});
        } else if(rate == 0){
            showAlert({title: 'Nota invalida', text: 'Debe dar al menos una estrella', icon: 'error'});
        } else {
            const ratingValue = {
                empresa: empresa.id,
                name: name,
                rate: rate,
                comment: comment
            }

            await createRating(ratingValue)
            cancelComment()
            showAlert(
                {title: 'Comentario enviado',
                text: 'El comentario se ha enviado satisfactoriamente',
                icon: 'success'
            },'redirect', `${pathname}?query=${empresa.name}`, router);
        }
    }

    return (
        <div className="mx-5 overflow-y-auto scrollBar my-4 border rounded-2xl shadow-2xl bg-gray-200 h-screen" style={{width: '1025px'}}>
            {contextHolder}
            <Carousel className="shadow-xl" autoplay autoplaySpeed={3000}>
                {localImages.map((image) => {
                    if(image.empresa == empresa.id){
                        return(
                            <div key={image.id}>
                                <Image width={1025} height={400} 
                                src={image.url}/>
                            </div>
                        )
                    }
                })}
            </Carousel>
            <div className="mx-4 my-4 flex" style={{gap: '28rem'}}>
                <div className="text-wrap">
                    <h2 className="font-bold text-3xl">{empresa.name}</h2>
                    <div className='flex mt-2 text-gray-400'>
                        <FaMapLocationDot className='text-xl me-1'/>
                        <p className="text-sm">{`${empresa.direction}, Republica Domminicana`}</p>
                    </div>
                </div>
                <div className="text-nowrap">
                    <Rate tooltips={desc} style={{fontSize: 40}} allowHalf disabled value={empresa.rate} />
                    <div className='flex text-sm flex-row-reverse mt-2 text-gray-400'>
                        <FaStar className='mt-0.5 me-3 ms-1'/>
                        <p>{`${desc[empresa.rate == 0 ? 0 : empresa.rate - 1]}`}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-20">
                <div>
                    <div className="bg-gray-300 scrollBar overflow-y-auto shadow-xl grid grid-cols-2 rounded-xl ms-10 h-20" style={{width: '450px', height: '200px'}}>
                        <div className="mx-2 mt-2">
                            <h4 className="text-xl text-nowrap font-semibold">Descripcion de la empresa:</h4>
                            <p className="text-wrap mt-2">{empresa.description}</p>
                            <h4 className="text-xl text-nowrap font-semibold mt-2">Productos y/o Servicios de la empresa:</h4>
                            <div className="grid grid-cols-5 gap-x-16 my-2 gap-y-1">
                                {productos.map(function(element, index){
                                    return(
                                    <div key={element + index} className="mx-2">
                                        <Tag className="hover:shadow-xl mx-2">
                                            <Link className="my-2" href={`/search?searchFor=Producto&query=${element}`}>{element}</Link>
                                        </Tag>
                                    </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-6 text-4xl mt-8 text-gray-400">
                    <div>
                        <div className="flex mb-20">
                            <FaInstagramSquare/>
                            <h4 className="font-semibold text-xl ms-1 mt-1">
                                <RenderIf render={empresa.instagram != ''}>
                                    <Link className="hover:underline" href={`${empresa?.instagram}`} target="_blank">{empresa.name}</Link>
                                </RenderIf>
                                <RenderIf render={empresa.instagram == ''}>
                                    -
                                </RenderIf>
                            </h4>
                        </div>
                        <div className="flex">
                            <FaFacebookSquare/>
                            <h4 className="font-semibold text-xl ms-1 mt-1">
                                <RenderIf render={empresa.facebook != ''}>
                                    <Link className="hover:underline" href={`${empresa?.facebook}`} target="_blank">{empresa.name}</Link>
                                </RenderIf>
                                <RenderIf render={empresa.facebook == ''}>
                                    -
                                </RenderIf>
                            </h4>
                        </div>
                    </div>
                    <div>
                        <div className="flex mb-20">
                            <FaWhatsapp/>
                            <h4 className="font-semibold text-xl ms-1 mt-1">
                                <RenderIf render={empresa.whatsapp != ''}>
                                <Tooltip title="Click para copiar el numero">
                                    <h4 onClick={() => copyNumber(empresa?.whatsapp)} className="hover:underline hover:cursor-pointer">{empresa?.whatsapp}</h4>
                                </Tooltip>
                                </RenderIf>
                                <RenderIf render={empresa.whatsapp == ''}>
                                    -
                                </RenderIf>
                            </h4>
                        </div>
                        <div className="flex">
                            <MdLocalPhone />
                            <h4 className="font-semibold text-xl ms-1 mt-1">
                                <RenderIf render={empresa.telefono != ''}>
                                <Tooltip title="Click para copiar el numero">
                                    <h4 onClick={() => copyNumber(empresa?.telefono)} className="hover:underline hover:cursor-pointer">{empresa?.telefono}</h4>
                                </Tooltip>
                                </RenderIf>
                                <RenderIf render={empresa.telefono == ''}>
                                    -
                                </RenderIf>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ms-8 mt-5">
                <h4 className="text-2xl text-gray-500 mb-3 font-semibold">Comentarios y notas</h4>
                <button onClick={() => setOpenModal(true)} className="border mb-2 rounded-xl flex bg-black text-white hover:bg-green-800">
                    <FaPlusCircle className="ms-2 me-1 mt-3"/><h5 className="me-2 my-2">Agregar comentario</h5>
                </button>
                <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
                    <Modal.Header>
                        <div className="flex text-2xl font-bold">
                            <FaPlusCircle className="ms-2 me-1 mt-1.5"/>
                            <div className="mt-0.5">Agregar Comentario</div>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="">
                        <h2 className="text-xl font-semibold ms-5 mb-1">Rellene los datos para su comentario</h2>
                        <hr className="border-1 rounded-full ms-5 mb-3 me-8"/>
                        <form className="mx-8">
                            <input type="hidden" value={empresa.id}/>
                            <FloatingLabel onChange={(e) => setName(e.target.value)} name="name" variant="outlined" label="Nombre Completo" value={name} required/>
                            <div className="mb-5 mt-3">
                                <h4 className="mb-1 font-medium">¿Como fue tu experiencia?</h4>
                                <Rate onChange={(value) => setRate(value)} tooltips={desc} style={{fontSize: 40}} value={rate}/>
                            </div>
                            <Textarea className={`${comment.length == 200 ? 'border-red-600 border-2' : ''}`} onChange={(e) => setComment(e.target.value)} value={comment} 
                            name="comment" placeholder="Escriba su comentario..." required rows={5} maxLength={200}/>
                            <div className="ms-96 ps-20 mt-0.5">
                                <p className={`${comment.length == 200 ? "text-red-600 font-semibold text-sm" : "text-gray-500 text-sm"}`}>{`${comment.length}/200`}</p>
                            </div>
                        </form>
                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="grid grid-cols-2 gap-28">
                            <div></div>
                            <div className="flex text-nowrap text-white">
                                <button onClick={sendComment} className="bg-black rounded-lg hover:bg-green-800"><div className="mx-2 my-2">Enviar Comentario</div></button>
                                <button onClick={cancelComment} className="mx-2 bg-black rounded-lg hover:bg-red-800"><div className="mx-2 my-2">Cancelar</div></button>
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>
                <div className="bg-white rounded-2xl mb-4 overflow-y-auto scrollBar" style={{width: '960px', height: '300px'}}>
                    <div className="text-white ms-5 select-none">h</div>
                    <RenderIf render={localRatings.length == 0}>
                        <div>
                            {ratings.map(function(rating){
                                
                                if(rating.empresa == empresa.id) {
                                    localRatings.push(rating);
                                }

                                return(
                                    <RenderIf key={rating.id} render={rating.empresa == empresa.id}>
                                        <div className="bg-gray-300 mx-8 mb-4 rounded-xl shadow-lg hover:shadow-xl">
                                            <div className="ms-6 mb-2 text-xl flex font-medium">
                                                <div className="mt-2">{`${rating.name}:`}</div>
                                                <div className="ms-5 mt-2">
                                                    <Rate style={{fontSize: 26}} disabled tooltips={desc} value={rating.rate}></Rate>
                                                </div>
                                            </div>
                                            <hr className="border-1 border-gray-400 rounded-full mx-4"/>
                                            <div className="ms-5 mt-2 pb-2">
                                                {rating.comment}
                                            </div>
                                        </div>
                                    </RenderIf>
                                )
                            })}
                        </div>
                    </RenderIf>
                    <RenderIf render={localRatings.length == 0}>
                        <div className="text-gray-500 ms-16">
                            <FaCommentSlash className="text-8xl mt-10 ms-96"/>
                            <h6 className="ms-48 text-2xl">No hay comentarios, se el primero en comentar.</h6>
                        </div>
                    </RenderIf>
                </div>
            </div>
        </div>
    )
}

export default CentralCard