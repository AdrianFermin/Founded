'use server'
import { getEmpresasByRate, getImages } from "@/app/lib/actions/empresa"
import RecomendationsCard from "../RecomendationsCard"
import { Empresa } from "@/app/lib/types"


const Recomendations = async() => {

    const data:Empresa[] = await getEmpresasByRate() ?? []
    const images:any[] = await getImages()

    return(
        <>
            <h3 className="font-semibold text-3xl ms-16 mt-16 mb-6">Recomendaciones</h3>
            <div className="flex flex-row ms-20 gap-12">
                {data.map(function(empresa:Empresa) {
                    return(<RecomendationsCard imagenes={images} key={empresa.id ?? 0} empresa={empresa}></RecomendationsCard>)
                })}
            </div>
        </>
    )
}

export default Recomendations