import { redirect } from "next/navigation";
import { getCategorias, getEmpresaBySecret, getImagesByCode, getLocations } from "../lib/actions/empresa";
import EmpresasForm from "../ui/register/EmpresasForm";

export default async function editPage({
    searchParams,
  }: {
    searchParams?: {
      code?: string;
    };
  }){

    const data = await getEmpresaBySecret(searchParams?.code || '')
    const locations = await getLocations();
    const categorias = await getCategorias();
    const imagenes = await getImagesByCode(searchParams?.code || '')

    if(data.res == 'FAILED'){
        redirect('/')
    }

    return(
        <>
            <EmpresasForm imagenes={imagenes} categorias={categorias} locations={locations} empresa={data.empresa}></EmpresasForm>
        </>
    )
}