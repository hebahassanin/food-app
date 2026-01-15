import React, { useEffect } from 'react'
import SideBar from '../SideBar/SideBar';
import NavBar from '../NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { useState } from 'react';

export default function MasterLayout() {

  const[isCollapsed, setIsCollapsed] = useState(false);

  // sidebar is collapsed on mobile and tablet , screen <768
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setIsCollapsed(true);
        }
      };
    
      handleResize();
      window.addEventListener('resize', handleResize);
    
      return () => window.removeEventListener('resize', handleResize);
    }, []);


  return (
    <>
      <div className='d-flex'>
        
          <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
        
        <div className={`main-content ${isCollapsed? 'collapsed':""}`}>
          <NavBar/>
          <Outlet/>
        </div>
      </div>
    </>
  )
}
