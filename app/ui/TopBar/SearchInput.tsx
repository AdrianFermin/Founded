'use client'

import React, { useState,useRef } from 'react';
import { FaFilter } from "react-icons/fa6";
import { Button, Modal } from 'flowbite-react';
import { IoSearch } from "react-icons/io5";
import { RenderIf } from '../view';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Label, Radio, Select } from 'flowbite-react';
import { Rate } from 'antd';

export function SearchInput({textColor, location, categorias, locations} :
  {textColor:string, location:string, categorias:any[], locations:any[]}){

  const [openModal, setOpenModal] = useState(false);
  const formularioRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const desc = ['Pasable', 'Normal', 'Bueno', 'Muy bueno', 'Excelente'];


  const dispararSubmit = () => {
    if (formularioRef.current !== null) {
      formularioRef.current.requestSubmit();
    } else {
      console.error("El formulario no pudo ser encontrado.");
    }
  };

  const handleSubmit = (event:any) => {
    event.preventDefault;
    const params = new URLSearchParams(searchParams);
    if(searchValue != "") {
      params.set('query', searchValue);
      replace(`/search?${params.toString()}`);
    } else {
      params.delete('query');
      replace(`/search?${params.toString()}`);
    }
  }

  //Filtros
  const [searchValue, setSearchValue] = useState(searchParams.get('query')?.toString() || "")
  const [searchFor, setSearchFor] = useState(searchParams.get('searchFor')?.toString() || 'Empresas')
  const [searchLocation, setSearchLocation] = useState(searchParams.get('location') || 0)
  const [rateValue, setRateValue] = useState(searchParams.get('rate') || 0);
  const [categoryValue, setCategoryValue] = useState(searchParams.get('category') || 0)
  const handleFilterCancel = () => {
    setSearchFor('Nombres');
    setSearchLocation(0);
    setRateValue(0);
    setCategoryValue(0)
    setOpenModal(false);
  }
  const handleFilterClean = () => {
    setSearchFor('Nombres');
    setSearchLocation(0);
    setRateValue(0);
    setCategoryValue(0)
    setSearchValue("")
    setOpenModal(false);
    const params = new URLSearchParams(searchParams);
    if(pathname == '/search'){
      replace(`/search`);
    }
  }
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    setOpenModal(false)
    if(searchValue != "") {
      params.set('query', searchValue);
    } else {
      params.delete('query')
    } 
    
    if (searchLocation != 0){
      params.set('location', searchLocation.toString());
    } else {
      params.delete('location')
    } 
    
    if (searchFor != 'Nombres'){
      params.set('searchFor', searchFor);
    } else {
      params.delete('searchFor')
    } 
    
    if (rateValue != 0){
      params.set('rate', rateValue.toString());
    } else {
      params.delete('rate')
    } 
    
    if (categoryValue != 0){
      params.set('category', categoryValue.toString());
    } else {
      params.delete('category')
    }
    replace(`/search?${params.toString()}`);
  }

  return (
    <>
      <RenderIf render={location == "/search"}>
      <div className='flex ms-14'>
        <button onClick={() => setOpenModal(true)} className={`text-2xl me-3 ${textColor}`}><FaFilter /></button>
        <form action={(e) => handleSubmit(e)} ref={formularioRef}>
          <input value={searchValue} className='border rounded-md mt-3 w-96 focus:border-black focus:border-2' type='text' placeholder='Buscar...' onChange={(e) => setSearchValue(e.target.value)}/>
        </form>
        <div onClick={(e) => dispararSubmit()} className='ps-3 pt-5'><button className={`text-2xl ${textColor}`}><IoSearch /></button></div>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          <div className='flex'>
            <FaFilter className='mt-1.5 text-2xl'/>
            <h2 className='ms-2 text-3xl'>Filtros</h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form>
            <div className='flex' style={{gap: '84px'}}>
              <div>
                <legend className="mb-4">Buscar por:</legend>
                  <div className='flex gap-4'>
                    <div className="flex items-center gap-1">
                      <Radio checked={searchFor == 'Empresas' ? true : false} onChange={(e) => setSearchFor(e.target.value)} id="empresa" name="filter-1" value="Empresas" />
                      <Label htmlFor="empresa">Empresas</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Radio checked={searchFor == 'Productos' ? true : false} onChange={(e) => setSearchFor(e.target.value)} id="Productos" name="filter-1" value="Productos"/>
                      <Label className='text-nowrap' htmlFor="Productos">Productos / Servicios</Label>
                    </div>
                  </div>
              </div>
              <div>
                <legend className="mb-2">Ubicacion:</legend>
                <Select onChange={(e) => setSearchLocation(parseInt(e.target.value))} sizing={'md'} id="ubicacion" required value={searchLocation}>
                  <option value={0}>Todo Santo Domingo</option>
                  {locations.map(function(location, index){
                    return <option key={location.id + index} value={location.id}>{location.value}</option>
                  })}
                </Select>
              </div>
            </div>
            <div className='flex gap-44'>
              <div>
                <legend className="mb-2 mt-5">Rating minimo:</legend>
                <div className='mt-3'>
                  <Rate style={{fontSize: 28}} tooltips={desc} onChange={setRateValue} value={parseInt(rateValue as string)} allowClear/>
                </div>
              </div>
              <div className='ms-1'>
                <legend className='mt-5'>Categoria:</legend>
                <Select onChange={(e) => setCategoryValue(parseInt(e.target.value))} sizing={'md'} id="ubicacion" required value={categoryValue}>
                  <option value={0}>General</option>
                  {categorias.map(function(categoria, index){
                    return <option key={categoria.id + index} value={categoria.id}>{categoria.name}</option>
                  })}
                </Select>
              </div>
            </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
            <div className='grid grid-cols-2 gap-36'>
              <div><Button onClick={handleFilterClean} className='bg-black text-white hover:bg-yellow-500' color={'black'}>Limpiar filtros</Button></div>
              <div className='flex text-nowrap'>
                <Button onClick={applyFilters} className='me-3 bg-black text-white hover:bg-green-800' color={'black'}>Aplicar filtros</Button>
                <Button onClick={handleFilterCancel} className='bg-black text-white hover:bg-red-800' color={'black'}>Cancelar</Button>
              </div>
            </div>
        </Modal.Footer>
      </Modal>
      </div>
      </RenderIf>
      <RenderIf render={location == '/'}>
      <div className='flex me-20' style={{marginInlineStart: '21rem'}}>
        <button onClick={() => setOpenModal(true)} className={`text-2xl me-3 mt-0.5 ${textColor}`}><FaFilter /></button>
        <form action={(e) => handleSubmit(e)} ref={formularioRef}>
          <input defaultValue={searchParams.get('query')?.toString()} className='border rounded-md w-96 focus:border-black focus:border-2' type='text' placeholder='Buscar...' onChange={(e) => setSearchValue(e.target.value)}/>
        </form>
        <div onClick={(e) => dispararSubmit()}  className='ms-3 mt-2.5'><button className={`text-2xl ${textColor}`}><IoSearch /></button></div>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
          <div className='flex'>
            <FaFilter className='mt-1.5 text-2xl'/>
            <h2 className='ms-2 text-3xl'>Filtros</h2>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <form>
            <div className='flex' style={{gap: '80px'}}>
              <div>
                <legend className="mb-4">Buscar por:</legend>
                  <div className='flex gap-4'>
                    <div className="flex items-center gap-1">
                      <Radio checked={searchFor == 'Empresas' ? true : false} onChange={(e) => setSearchFor(e.target.value)} id="empresa" name="filter-1" value="Nombres" />
                      <Label htmlFor="empresa">Empresas</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Radio checked={searchFor == 'Productos' ? true : false} onChange={(e) => setSearchFor(e.target.value)} id="Productos" name="filter-1" value="Productos"/>
                      <Label htmlFor="Productos">Productos / Servicios</Label>
                    </div>
                  </div>
              </div>
              <div>
                <legend className="mb-2">Ubicacion:</legend>
                <Select onChange={(e) => setSearchLocation(parseInt(e.target.value))} sizing={'md'} id="ubicacion" required value={searchLocation}>
                  <option value={0}>Todo Santo Domingo</option>
                  {locations.map(function(location, index){
                    return <option key={location.id + index} value={location.id}>{location.value}</option>
                  })}
                </Select>
              </div>
            </div>
            <div className='flex gap-44'>
              <div>
                <legend className="mb-2 mt-5">Rating minimo:</legend>
                <div className='mt-3'>
                  <Rate style={{fontSize: 28}} tooltips={desc} onChange={setRateValue} value={parseInt(rateValue as string)} allowClear/>
                </div>
              </div>
              <div className=''>
                <legend className='mt-5'>Categoria:</legend>
                <Select onChange={(e) => setCategoryValue(parseInt(e.target.value))} sizing={'md'} id="ubicacion" required value={categoryValue}>
                  <option value={0}>General</option>
                  {categorias.map(function(categoria, index){
                    return <option key={categoria.id + index} value={categoria.id}>{categoria.name}</option>
                  })}
                </Select>
              </div>
            </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
            <div className='grid grid-cols-2 gap-36'>
              <div><Button onClick={handleFilterClean} className='bg-black text-white hover:bg-yellow-500' color={'black'}>Limpiar filtros</Button></div>
              <div className='flex text-nowrap'>
                <Button onClick={applyFilters} className='me-3 bg-black text-white hover:bg-green-800' color={'black'}>Aplicar filtros</Button>
                <Button onClick={handleFilterCancel} className='bg-black text-white hover:bg-red-800' color={'black'}>Cancelar</Button>
              </div>
            </div>
        </Modal.Footer>
      </Modal>
      </div>
      </RenderIf>
    </>
  );
};