import SearchBar from "../ui/search/SearchBar";
import { getAllEmpresas, getEmpresasByFilters, getImages, getLocations, getRatings } from "../lib/actions/empresa";
import { Empresa } from "../lib/types";
import SearchContent from "../ui/search/SearchContent";

async function SearchPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    searchfor?: string;
    rate?: string;
    category?: string;
    orderBy?: string;
  };
}){

  let keys = Object.keys(searchParams || {})
  let empresas:Empresa[];

  if(keys.length == 0 || keys.length == 1 && keys[0] == "searchFor" || keys.length == 1 && searchParams?.query == ""){
    empresas = await getAllEmpresas();
  } else {
    empresas = await getEmpresasByFilters(searchParams);
  }
  const locations = await getLocations();
  const ratings = await getRatings();
  const images = await getImages();

  return (
    <>
      <SearchBar></SearchBar>
      <SearchContent images={images} ratings={ratings} locations={locations} data={empresas}></SearchContent>
    </>
  );
}

export default SearchPage; 