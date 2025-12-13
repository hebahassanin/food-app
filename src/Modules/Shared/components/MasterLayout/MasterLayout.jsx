import React from 'react'
import SideBar from '../SideBar/SideBar';
import NavBar from '../NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import { useState } from 'react';

export default function MasterLayout() {

  const[isCollapsed, setIsCollapsed] = useState(false);
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
