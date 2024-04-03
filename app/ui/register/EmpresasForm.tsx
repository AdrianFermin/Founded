'use client'

import React from 'react';
import Swal from 'sweetalert2';
import { useState } from "react"
import RegisterTop from "./RegisterTop"
import { Empresa } from "@/app/lib/types"
import { FloatingLabel, Select, Textarea } from 'flowbite-react';
import { IoIosInformationCircle } from "react-icons/io";
import { usePathname, useRouter } from "next/navigation";
import { Select as SelectAnt } from "antd";
import type { SelectProps } from 'antd';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { deleteDirectory, deleteFilesByUrls, showAlert } from '@/app/lib/functions';
import dayjs from 'dayjs';
import { createEmpresa, createImages, updateEmpresa, updateImages } from '@/app/lib/actions/empresa';
import FormUpload from './FormUpload';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import { storage } from "@/firebase/clientApp";
import { hashObjectString } from '@/app/lib/cripto';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const EmpresasForm = ({empresa, locations, categorias, imagenes} : {imagenes:any[],empresa?: Empresa, locations: any[], categorias: any[]}) => {

    const options: SelectProps['options'] = [];
    const MAX_COUNT = 10;

    const [name, setName] = useState(empresa?.name || "")
    const [userName, setUserName] = useState(empresa?.created_by || "")
    const [category, setCategory] = useState(empresa?.category || 0)
    const [description, setDescription] = useState(empresa?.description || "")
    const [location, setLocation] = useState(empresa?.location || 0)
    const [direction, setDirection] = useState(empresa?.direction || "")
    const [instagram, setInstagram] = useState(empresa?.instagram || "")
    const [facebook, setFacebook] = useState(empresa?.facebook || "")
    const [whatsapp, setWhatsapp] = useState(empresa?.whatsapp || "")
    const [telefono, setTelefono] = useState(empresa?.telefono || "")
    const [productos, setProductos] = useState(empresa?.productos.split(',') || [])
    const [fileList, setFileList] = useState<any[]>(imagenes || [])
    const [imageList, setImageList] = useState<any[]>(imagenes)

    const suffix = (
        <>
          <span>
            {productos.length} / {MAX_COUNT}
          </span>
          <MdOutlineKeyboardArrowDown />
        </>
      );

    const pathname = usePathname();
    const router = useRouter();

    const handleSubmit = async() => {
        if(name.length < 4){
            showAlert({icon: 'error', title: 'Nombre incorrecto', text: 'El nombre de empresa ingresado es muy corto, minimo 4 caracteres'})
        } else if(userName.length < 4){
            showAlert({icon: 'error', title: 'Nombre incorrecto', text: 'El nombre del creador ingresado es muy corto, minimo 4 caracteres'})
        } else if(category == 0){
            showAlert({icon: 'error', title: 'Categoria incorrecta', text: 'Seleccione una categoria'})
        } else if(location == 0){
            showAlert({icon: 'error', title: 'Ubicacion incorrecta', text: 'Seleccione una ubicacion'})
        } else if(productos.length < 10){
            showAlert({icon: 'error', title: 'Productos insuficientes', text: 'Por favor ingrese al menos 10 productos'})
        } else if(description.length < 20){
            showAlert({icon: 'error', title: 'Descripcion incorrecta', text: 'La direccion ingresada es muy corta, minimo 20 caracteres'})
        } else if(fileList.length == 0){
            showAlert({icon: 'error', title: 'Imagenes insuficientes', text: 'Debe agregar minimo una(1) imagen'})
        } else if(fileList.length > 3){
            showAlert({icon: 'error', title: 'Demasiadas imagenes', text: 'Puede agregar un maximo de tres(3) imagenes'})
        } else {

            let date = dayjs(new Date).format('YYYY-MM-DD HH:mm:ss');
            const data:Empresa = {
                id: empresa?.id,
                name: name,
                created_by: userName,
                category: category,
                description: description,
                status: 1,
                creation_date: date,
                rate: empresa?.rate || 0,
                location: location,
                direction: direction,
                instagram: instagram,
                facebook: facebook,
                whatsapp: whatsapp,
                telefono: telefono,
                productos: productos.join(",").replace(/[']/g, '')
            }

            if(pathname == '/edit'){
                fileList.forEach(async function(element:any, index){
                    if(element.url == undefined){
                        if (!element.url && !element.preview) {
                            element.preview = await getBase64(element.originFileObj as FileType);
                        }
                        const response = await fetch(element.url || (element.preview as string));
                        const blob = await response.blob();
            
                        const imgName = await hashObjectString(element)
                        const imgRef = ref(storage, `images/${data.name}/${imgName}`);
                        await uploadBytes(imgRef, blob)
                    } else {
                        const response = await fetch(element.url)
                        const blob = await response.blob();
                        const imgName = await hashObjectString(element)
                        const imgRef = ref(storage, `images/${data.name}/${imgName}`);
                        await uploadBytes(imgRef, blob)
                    }
                })
                let imageUrls:any[] = [];
                imageList.forEach((image) => {
                    imageUrls.push(image.url)
                })
                await deleteFilesByUrls(ref(storage, `images/${data.name}`), imageUrls)
                const result = await updateEmpresa(data);
                Swal.fire({
                    icon: 'info',
                    title: 'Subiendo imagenes...',
                    text: 'Espere un momento por favor, sus imagenes se estan subiendo',
                    timer: 5000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                })
                window.setTimeout(async() => {
                    await updateImages(data.name, result[0].empresa)
                    showAlert({icon: 'success', title: 'Edicion completada', text: 'La empresa se actualizo correctamente'},
                        'redirect', `/search?query=${data.name}`, router)
                }, 5000)
            } else {
                fileList.forEach(async function(element:UploadFile, index){
                    if (!element.url && !element.preview) {
                        element.preview = await getBase64(element.originFileObj as FileType);
                    }
                    const response = await fetch(element.url || (element.preview as string));
                    const blob = await response.blob();
        
                    const imgName = await hashObjectString(element)
                    const imgRef = ref(storage, `images/${data.name}/${imgName}`);
                    await uploadBytes(imgRef, blob)
                })
                 
                const result = await createEmpresa(data)
                Swal.fire({
                    icon: 'info',
                    title: 'Subiendo imagenes...',
                    text: 'Espere un momento por favor, sus imagenes se estan subiendo',
                    timer: 5000,
                    timerProgressBar: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                })
                window.setTimeout(async() => {
                    await createImages(data.name, result[0].empresa)
                    showAlert({icon: 'success', title: 'Registro completado', text: `La empresa se registro correctamente, si desea editarla use este codigo secreto: ${result[0].code}`},
                    'redirect-noTimer', `/search?query=${data.name}`, router)
                }, 5000)
                
            }

        }
    }

    const handleCancel = () => {
        router.replace('/')
    }

    return(
        <>
            <RegisterTop></RegisterTop>
            <div className="my-10 grid grid-cols-3">
                <div></div>
                <div className="rounded-xl shadow-xl ">
                    <div className="text-3xl text-center mt-4 font-semibold">Formulario de empresas</div>
                    <hr className="mx-4 my-1"/>
                    <div className="mt-4">
                        <div className="mx-4 gap-x-6 gap-y-4 grid grid-cols-2">
                            <FloatingLabel value={name} onChange={(e) => setName(e.target.value)} variant="outlined" label="Nombre de la empresa" disabled={pathname == '/edit' ? true : false}/>
                            <FloatingLabel value={userName} onChange={(e) => setUserName(e.target.value)} variant="outlined" label="Nombre del dueño" />
                            <Select style={{height: '48px'}} onChange={(e) => setCategory(parseInt(e.target.value))} sizing={'md'} id="ubicacion" required value={category}>
                            <option value={0}>Elija la categoria de su empresa</option>
                            {categorias.map(function(categoria, index){
                                return <option key={categoria.id + index} value={categoria.id}>{categoria.name}</option>
                            })}
                            </Select>
                            <Select style={{height: '48px'}} onChange={(e) => setLocation(parseInt(e.target.value))} sizing={'md'} id="ubicacion" required value={location}>
                            <option value={0}>Elija su ubicacion más cercana</option>
                            {locations.map(function(location, index){
                                return <option key={location.id + index} value={location.id}>{location.value}</option>
                            })}
                            </Select>
                        </div>
                        <div className="mx-4 mt-4">
                            <FloatingLabel value={direction} onChange={(e) => setDirection(e.target.value)} variant="outlined" label="Direccion de la empresa" />
                            <p className="text-gray-500 text-xs ms-1 flex"><IoIosInformationCircle className="mt-0.5 me-0.5"/>Dejar vacio si no tiene local fisico.</p>
                        </div>
                    </div>
                    <div className="mx-4 mt-4 gap-x-6 gap-y-4 grid grid-cols-2">
                    <FloatingLabel value={instagram} onChange={(e) => setInstagram(e.target.value)} variant="outlined" label="Instagram" />
                    <FloatingLabel value={facebook} onChange={(e) => setFacebook(e.target.value)} variant="outlined" label="Facebook" />
                    <FloatingLabel value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} variant="outlined" label="Whatsapp" />
                    <FloatingLabel value={telefono} onChange={(e) => setTelefono(e.target.value)} variant="outlined" label="Telefono" />
                    </div>
                    <p className="text-gray-500 text-xs ms-5 flex"><IoIosInformationCircle className="mt-0.5 me-0.5"/>Puede dejar vacias las que no tenga.</p>
                    <div className="mx-4 mt-2">
                        <SelectAnt
                            value={productos}
                            mode="tags"
                            onChange={setProductos}
                            suffixIcon={suffix}
                            style={{ width: '100%' }}
                            placeholder="Productos/servicios que ofrece"
                            options={options}
                        />
                        <p className="text-gray-500 text-xs ms-1 mt-2 flex"><IoIosInformationCircle className="mt-0.5 me-0.5"/>Minimo 10, tratar de ser precisos. Ej: Laptop, Muñecos de lana, Pizza.</p>
                    </div>
                    <div className="mx-4 mt-4">
                        <Textarea className={`${description.length == 200 ? 'border-red-600 border-2' : ''}`} onChange={(e) => setDescription(e.target.value)} value={description} 
                                name="comment" placeholder="Describa su empresa..." required rows={5} maxLength={200}/>
                        <div style={{marginInlineStart: '390x'}}>
                            <p className={`${description.length == 200 ? "text-red-600 font-semibold text-sm" : "text-gray-500 text-sm"}`}>{`${description.length}/200`}</p>
                        </div>
                    </div>
                    <div className='mx-4 mt-4'>
                        <FormUpload fileList={fileList} setFileList={setFileList}></FormUpload>
                        <p className="text-gray-500 text-xs ms-1 flex"><IoIosInformationCircle className="mt-0.5 me-0.5"/>Minimo: 1, Maximo: 3. Los archivos deben ser .JPG, .JPEG o .PNG</p>
                    </div>
                    <div className="place-items-center items-center text-center mb-5 mt-3 font-semibold">
                        <button onClick={handleSubmit} className="rounded-xl bg-black text-white text-lg hover:bg-green-800 me-5">
                            <div className="mx-2 my-2">{pathname == '/edit' ? 'Actualizar empresa' : 'Registrar empresa'}</div>
                        </button>
                        <button onClick={handleCancel} className="rounded-xl bg-black text-white text-lg hover:bg-red-800">
                            <div className="mx-2 my-2">Cancelar</div>
                        </button>
                    </div>
                </div>
                <div></div>
            </div>
        </>
    )
}

export default EmpresasForm