'use client'

import { Empresa, Rating } from "@/app/lib/types"
import SearchCard from "./SearchCard"
import CentralCard from "./CentralCard"
import { useEffect, useState } from "react"
import { RenderIf } from "../view"
import { MdSearchOff } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";

const SearchContent = ({data, locations, ratings, images}: {data: Empresa[], locations: any[], ratings: Rating[], images: any[]}) => {

    const [centralData, setCentalData] = useState(data);
    const [centralContent, setCentralContent] = useState(centralData[0])

    return (
        <>
            <div className="flex">
                <div className="bg-gray-200 rounded-2xl shadow-xl my-4 ms-2">
                    <div className="overflow-y-auto scrollBar" style={{height: '700px'}}>
                        <RenderIf render={data.length > 0}>
                            {data.map(function(empresa){
                            return(
                                <div key={empresa.id} className={`mx-5 ms-8 my-5`}>
                                    <SearchCard imagenes={images} setter={setCentralContent} location={`${locations[empresa.location - 1].value}`} empresa={empresa}></SearchCard>
                                </div>
                            )
                            })}
                        </RenderIf>
                        <RenderIf render={data.length <= 0}>
                            <div style={{width: 350}}>
                                <div className="text-gray-500">
                                    <MdSearchOff className="ms-32 mt-60 text-6xl"/>
                                    <h4 className="text-lg me-1 mt-0.5 text-wrap text-center">Lo sentimos, no se ha encontrado ningun elemento que coincida con los filtros aplicados.</h4>
                                </div>
                            </div>
                        </RenderIf>
                    </div>
                </div>
                <div>
                    <RenderIf render={data.length > 0 && centralContent != undefined}>
                        <CentralCard images={images} ratings={ratings} empresa={centralContent}></CentralCard>
                    </RenderIf>
                    <RenderIf render={data.length > 0 && centralContent == undefined}>
                        <div>
                            <div className="text-gray-500">
                                <GrStatusGood className="mt-48 text-8xl" style={{marginInlineStart: '31rem'}}/>
                                <h4 className="text-lg mt-1 text-wrap text-center" style={{marginInlineStart: '22rem'}}>Haga click en una empresa para ver los detalles.</h4>
                            </div>
                        </div>
                    </RenderIf>
                    <RenderIf render={data.length <= 0}>
                        <div>
                            <div className="text-gray-500">
                                <MdSearchOff className="mt-48 text-8xl" style={{marginInlineStart: '31rem'}}/>
                                <h4 className="text-lg ms-52 mt-0.5 text-wrap text-center">Lo sentimos, no se ha encontrado ningun elemento que coincida con los filtros aplicados.</h4>
                            </div>
                        </div>
                    </RenderIf>
                </div>
            </div>
        </>
    )
}

export default SearchContent