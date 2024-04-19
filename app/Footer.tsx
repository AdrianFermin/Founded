
'use client';

import { Footer } from 'flowbite-react';
import { BsGithub } from 'react-icons/bs';

export default function Foooter() {
  return (
    <Footer container className='bg-gray-200 absolute'>
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <div>
            <Footer.Brand
              href="localhost:3000/"
              src="/logoNegro.png"
              alt="Founded Logo"
              className='text-red-500'
              target="_blank"
            />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            <div></div>
            <div>
              <Footer.Title title="about" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://docs.google.com/document/d/1BtHGAK0jolOmTzTqTG38KGLWqzmVqwyB/edit?usp=sharing&ouid=113384998862679000045&rtpof=true&sd=true" target="_blank">Documentacion</Footer.Link>
                <Footer.Link href="#" target="_blank">Equipo</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link href="https://github.com/AdrianFermin/Founded" target="_blank">Github</Footer.Link>
              </Footer.LinkGroup>
            </div>
            
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="/" by="Founded" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="https://github.com/AdrianFermin/Founded" icon={BsGithub} target="_blank"/>
          </div>
        </div>
      </div>
    </Footer>
  );
}
