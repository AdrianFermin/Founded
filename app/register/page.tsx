import { getLocations, getCategorias } from "../lib/actions/empresa";
import EmpresasForm from "../ui/register/EmpresasForm";

export default async function registerPage(){

    const locations = await getLocations();
    const categorias = await getCategorias();

    return(
        <>
            <EmpresasForm categorias={categorias} locations={locations}></EmpresasForm>
        </>
    )
}