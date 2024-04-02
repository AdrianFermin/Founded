'use client'

import Swal from 'sweetalert2';
import { FirebaseApp } from '@firebase/app-types';
import { Reference, ListResult } from '@firebase/storage-types';
import { getMetadata, deleteObject, listAll, getDownloadURL } from "firebase/storage";

export function showAlert(props: any, type: string = "basic", redirectPath?: string, router?:any){

    if(type == "basic"){
        Swal.fire({
            ...props,
            timer: 2000,
            timerProgressBar: true
        })
    } else if(type == "redirect"){
        Swal.fire({
            ...props,
            timer: 2000,
            timerProgressBar: true
        }).then((result) => {
            if(result.dismiss){
                router.push(redirectPath || "/");
            } else if(result.isConfirmed) {
                router.push(redirectPath || "/");
            }
        })
    } else if(type == "redirect-noTimer"){
        Swal.fire({
            ...props,
        }).then((result) => {
            if(result.dismiss){
                router.push(redirectPath || "/");
            } else if(result.isConfirmed) {
                router.push(redirectPath || "/");
            }
        })
    }
}

export function setCookie(value: string) {
    document.cookie = "founded_session" + "=" + value + ";path=/";
}

export function checkCookie(cookieName: string) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return true;
        }
    }
    return false;
}

export function checkCookieValue(cookieName: string = "founded_session"): string | undefined {
    if(typeof document !== 'undefined'){
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
                const cookieValue = cookie.substring(cookieName.length + 1);
                return decodeURIComponent(cookieValue);
            }
        }
        return undefined;
    } else {
        return undefined
    }
}

export const deleteDirectory = async (fileRef: any) => {
    getMetadata(fileRef)
  .then((metadata:any) => {
    // Elimina el archivo si existe
    deleteObject(fileRef)
      .then(() => {
        console.log('Archivo eliminado correctamente.');
      })
      .catch((error) => {
        console.error('Error al eliminar el archivo:', error);
      });
  })
  .catch((error) => {
    console.error('Error al obtener los metadatos del archivo:', error);
  });
  };

  export const deleteFilesByUrls = async (directoryRef: any, urlsToDelete: any[]) => {
    try {
      // Obtener una lista de elementos (archivos y subdirectorios) dentro del directorio
      const listResult = await listAll(directoryRef);
  
      // Recorrer todos los elementos y eliminar los archivos cuyas URL coincidan con las proporcionadas
      await Promise.all(listResult.items.map(async (itemRef) => {
        // Si es un archivo, obtener su URL y verificar si coincide con alguna de las URL proporcionadas
        const fileUrl = await getDownloadURL(itemRef);
        if (urlsToDelete.includes(fileUrl)) {
        await deleteObject(itemRef);
        console.log('Archivo eliminado:', itemRef.fullPath);
        }
      }));
    } catch (error) {
      console.error('Error al eliminar archivos por URL:', error);
    }
  };
  
  
