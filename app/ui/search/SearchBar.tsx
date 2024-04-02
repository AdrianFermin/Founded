'use server'
import Image from "next/image"
import { SearchInput } from "../TopBar/SearchInput"
import Link from "next/link"
import TopBarButtons from "../TopBar/TopBarButtons"
import { getCategorias, getLocations } from "@/app/lib/actions/empresa"

const SearchBar = async() => {

    const categorias = await getCategorias();
    const locations = await getLocations();

    return(
        <>
            <div className="shadow-lg grid grid-cols-3 relative">
                <div><Link href={"/"}><Image className='ms-2 py-4' height={10} width={200} alt='Logo' src={"/logoNegro.png"}/></Link></div>
                <SearchInput locations={locations} location="/search" textColor='text-black' categorias={categorias}></SearchInput>
                <TopBarButtons props={{textColor: 'text-black', pill:false, location: '/search'}}></TopBarButtons>
            </div>
        </>
    )
}

export default SearchBar