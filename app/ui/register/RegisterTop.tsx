'use client'

import Link from "next/link"
import Image from "next/image"

const RegisterTop = () => {

    return(
        <>
            <div className="shadow-lg grid grid-cols-3 relative">
                <div><Link href={"/"}><Image className='ms-2 py-4' height={10} width={200} alt='Logo' src={"/logoNegro.png"}/></Link></div>
            </div>
        </>
    )
}

export default RegisterTop