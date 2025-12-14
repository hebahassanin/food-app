import React from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { CiHome } from "react-icons/ci";
import { HiUsers } from "react-icons/hi2";
import { FaQrcode } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { FaUnlockAlt } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import logo from '../../../../assets/images/logo-sidebar.png';
import { useState } from 'react';

import { IoMdHome } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";

export default function SideBar({isCollapsed, setIsCollapsed}) {
  

  // add active class to links in sidebar
  const {pathname}=useLocation();

  const toggleCollapse =()=>{
    setIsCollapsed(!isCollapsed);
  }

  return (
    <>
    <div className="sidebar-container">
    <Sidebar collapsed={isCollapsed}>
      <Menu>
        <div className="img py-4">
         <img className='w-100' onClick={toggleCollapse} src={logo} alt='logo'/>
        </div>
        
        <MenuItem component={<Link to="/dashboard"/>} icon={<IoMdHome />} className={`${pathname === '/dashboard'? "active": null}`}>Home</MenuItem>
        <MenuItem component={<Link to="/dashboard/users"/>} icon={<HiUsers />} className={`${pathname === '/dashboard/users'? "active": null}`}>Users</MenuItem>
        <MenuItem component={<Link to="/dashboard/recipes"/>} icon={<FaQrcode />} className={`${pathname === '/dashboard/recipes'? "active": null}`}>Recipes</MenuItem>
        <MenuItem component={<Link to="/dashboard/categories"/>} icon={<LuCalendarDays />} className={`${pathname === '/dashboard/categories'? "active": null}`}>Categories</MenuItem>
        <MenuItem icon={<FaUnlockAlt />}>Change Password</MenuItem>
        <MenuItem component={<Link to="/login"/>} icon={<IoLogOut />}>Logout</MenuItem>
      </Menu>
    </Sidebar>
    </div>
      
      
    </>
  )
}
