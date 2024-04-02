'use server'
import TopBar from './ui/TopBar/TopBar';
import Recomendations from './ui/index/Recomendations';
import RecentEmpresas from './ui/index/RecentEmpresas';

async function IndexPage(){

  return (
    <>
      <TopBar></TopBar>
      <Recomendations></Recomendations>
      <RecentEmpresas></RecentEmpresas>
    </>
  );
}

export default IndexPage; 
