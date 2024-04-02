'use client'

import { Empresa } from '@/app/lib/types';
import {SearchInput} from './SearchInput';
import TopBarButtons from './TopBarButtons';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const TopContent = ({empresas, categorias, locations} : {empresas: Empresa[], categorias:any[], locations: any[]}) => {

    const [location, setLocation] = useState(0)

    if (typeof window !== 'undefined') {
        var scrollVertical = window.scrollY || window.pageYOffset;
        const handleScroll = (event:any) => {
            scrollVertical = window.scrollY || window.pageYOffset;
            setLocation(scrollVertical);
        }
        
        useEffect(function(){
            setLocation(scrollVertical);
        },[])

        window.addEventListener('wheel', (e) => handleScroll(e))
      }


    if(location <= 100){
        return(
            <>
                <div className=''>
                    <Image className='fixed top-0 z-10' height={20} width={2000} alt='Logo' src={"/shadow.svg"}/>
                    <div className="grid grid-col-3 mx-4 mt-8 z-10 fixed top-2">
                        <div className='flex'>
                            <Link href={"/"}>
                                <Image className='ms-2' height={1} width={200} alt='Logo' src={"/logoBlanco.png"}/>
                            </Link>
                            <SearchInput locations={locations} categorias={categorias} location='/' textColor='text-white'></SearchInput>
                            <TopBarButtons props={{textColor: 'text-white', pill:false, location: '/'}}></TopBarButtons>
                        </div>
                    </div>
                </div>
            </>
        )
    } else {
        return(
            <>
                <div className='z-10' style={{background: "#ffffff"}}>
                    <div className="flex border-2 border-black mx-4 mt-8 z-10 fixed top-2 rounded-full drop-shadow-2xl" style={{background: "#ffffff"}}>
                        <div className='my-2 flex'>
                            <Link className='flex' href={"/"}>
                                <Image className='ms-4' height={10} width={200} alt='Logo' src={"/logoNegro.png"}/>
                            </Link>
                            <SearchInput locations={locations} categorias={categorias} location='/' textColor='text-black'></SearchInput>
                            <TopBarButtons props={{pill: true, textColor: 'text-black', location: '/'}}></TopBarButtons>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default TopContent