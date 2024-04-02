'use client'
import { Button, Modal,FloatingLabel } from 'flowbite-react';
import { Tabs } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { RenderIf } from '../view';
import { FaPlusCircle, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { getEmpresaBySecret } from '@/app/lib/actions/empresa';
import { showAlert } from '@/app/lib/functions';


const TopBarButtons = ({props}:{props: {pill: boolean; textColor:string; location: string;}}) => {

    const [openModal, setOpenModal] = useState(false)
    const [secret, setSecret] = useState('')
    const router = useRouter();
    const { replace } = useRouter();

    const handleRegister = () => {
        replace(`/register`);
    }
    
    const handleEdit = async() => {
        
        if(secret.length > 0){
            const result = await getEmpresaBySecret(secret);

            if(result.res == 'OK'){
                showAlert({icon: 'success',title: 'Empresa encontrada',
                text: 'Sera redirigido para editar los datos de su empresa.'},'redirect',
                `/edit?code=${secret}`, router)
            } else {
                showAlert({icon: 'error',title: 'Codigo incorrecto', 
                text: 'No hay ninguna empresa registrada con ese codigo, verifique que ingreso el codigo correctamente.'})
            }

        } else {
            showAlert({icon: 'error',title: 'Campo vacio', text: 'Por favor ingrese su codigo secreto.'})
        }
    }

    return (
        <>
            <RenderIf render={props.location == "/"}>
                <div className=' flex'>
                    <div className={`flex ms-2`}>
                        <div onClick={() => setOpenModal(true)} className={`mt-1 ${props.pill == true ? 'me-4' : ''} ms-40`}>
                            <Button color={'black'} pill={props.pill} className={`w-50 ${props.textColor} border-0 bg-transparent text-nowrap hover:text-white hover:bg-black`}>Registra tu negocio</Button>
                        </div>
                    </div>
                </div>
            </RenderIf>
            <RenderIf render={props.location == "/search"}>
                <div className=' flex mt-1'>
                    <div className={`flex ms-2`}>
                        <div onClick={() => setOpenModal(true)} className={`mt-2 ${props.pill == true ? 'me-4' : ''} ms-64`}>
                            <Button color={'black'} pill={props.pill} className={`w-50 ${props.textColor} border-0 bg-transparent text-nowrap hover:text-white hover:bg-black`}>Registra tu negocio</Button>
                        </div>
                    </div>
                </div>
            </RenderIf>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>
                    <div className='text-2xl font-bold'>Registro de empresas</div>
                </Modal.Header>
                <Modal.Body>
                <div className="pb-5">
                    <Tabs size='large' defaultActiveKey="1" centered>
                        <Tabs.TabPane tab='Registrar empresa' key={'1'}>
                            <div className='text-center text-2xl font-semibold'>
                                ¿Desea registrar su empresa?
                            </div>
                            <div className='text-center text-2xl font-normal'>
                                Haga click en el boton para ir al formulario
                            </div>
                            <div className='mt-2 ms-56'>
                                <button onClick={handleRegister} className='rounded-lg bg-black text-white hover:bg-green-800'>
                                    <div className='my-2 mx-2'>Registrar empresa</div>
                                </button>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab='Editar empresa' key={'2'}>
                            <div className='text-center text-2xl font-semibold'>
                                ¿Desea editar su empresa registrada?
                            </div>
                            <div className='text-center text-2xl font-normal'>
                                Ingrese su codigo secreto y haga click en el boton
                            </div>
                            <div className='mx-10 my-4'>
                                <FloatingLabel onChange={(e) => setSecret(e.target.value)} value={secret} variant="outlined" label="Codigo Secreto"/>
                            </div>
                            <div className='mt-2 ms-56'>
                                <button onClick={handleEdit} className='rounded-lg bg-black text-white hover:bg-green-800'>
                                    <div className='my-2 mx-2'>Editar empresa</div>
                                </button>
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
                </Modal.Body>
                <Modal.Footer>
                
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default TopBarButtons;