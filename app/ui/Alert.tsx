'use client'

import { showAlert } from "../lib/functions";
import { AlertProps } from "../lib/types";
import { useRouter } from 'next/navigation';

const Alert = ({state, location}: {state:string, location: string}) => {

    const router = useRouter();

    if(location == "register"){
        if(state == "badEmail"){
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Email en uso',
                text:"El Email introducido ya esta registrado"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "badPass"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Contraseñas no coinciden',
                text:"Las contraseñas deben ser iguales"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "shortName"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Nombre muy corto',
                text:"El nombre debe contener al menos 8 caracteres"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "usedUserName"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Nombre de usuario en uso',
                text:"El nombre de usuario ingresado ya se encuentra en uso"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "shortUserName"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Nombre de usuario muy corto',
                text:"El nombre de usuario debe contener al menos 8 caracteres o estar vacio"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "badUserName"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Nombre de usuario incorrecto',
                text:"El nombre de usuario no puede contener espacios"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "shortPass"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Contraseña muy corta',
                text:"La contraseña debe contener al menos 6 caracteres"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "badGender"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Genero vacio',
                text:"Seleccione un genero para continuar"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "success"){
    
            let alertProps: AlertProps = {
                icon: 'success',
                title: 'Usuario registrado',
                text:"El usuario se registro correctamente, ya puede iniciar sesion"
            }
            showAlert(alertProps, "redirect", "/login", router)
            state = "";
        }
    } else if(location == "login"){
        if(state == "goodLogin"){
            let alertProps: AlertProps = {
                icon: 'success',
                title: 'Credenciales correctas',
                text:"Ha iniciado sesion satisfactoriamente"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "noEmail"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Email no registrado',
                text:"El email introducido no se encuentra registrado"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "inactiveLogin"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Usuario inactivo',
                text:"El usuario introducido ha sido desactivado permanentemente"
            }
            showAlert(alertProps)
            state = "";
        } else if(state == "badLogin"){
    
            let alertProps: AlertProps = {
                icon: 'error',
                title: 'Credenciales incorrectas',
                text:"El Email y/o la contraseña es incorrecto"
            }
            showAlert(alertProps)
            state = "";
        }
    }

    return <></>
}

export default Alert