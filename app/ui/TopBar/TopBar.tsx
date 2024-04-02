'use server';
import { getEmpresas, getCategorias, getLocations, getPortadaImages } from '../../lib/actions/empresa';
import TopBarCarousel from './TopBarCarousel';
import TopContent from './TopContent';

export default async function TopBar() {

    const empresas = await getEmpresas() ?? [];
    const categorias = await getCategorias();
    const locations = await getLocations();
    const imagenes = await getPortadaImages();

    return (
        <>
            <div>
                <TopContent locations={locations} categorias={categorias} empresas={empresas}></TopContent>
                <TopBarCarousel imagenes={imagenes}></TopBarCarousel>
            </div>
        </>
    );
}
