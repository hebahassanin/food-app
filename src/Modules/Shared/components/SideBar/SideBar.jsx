import React from 'react'
import { Sidebar, Menu, MenuItem} from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { HiUsers } from "react-icons/hi2";
import { FaQrcode } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import { FaUnlockAlt } from "react-icons/fa";
import logo from '../../../../assets/images/logo-sidebar.png';

import { IoMdHome } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { MdFavoriteBorder } from "react-icons/md";

export default function SideBar({isCollapsed, setIsCollapsed}) {

  const {logoutUser,userData}= useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout=()=>{
    logoutUser();
    navigate("/login");
   }
  

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

        {userData?.userGroup != 'SystemUser' ?
          <MenuItem component={<Link to="/dashboard/users"/>}
          icon={<HiUsers />} className={`${pathname === '/dashboard/users'? "active": null}`}>
            Users
          </MenuItem> :''
        }
       
        <MenuItem component={<Link to="/dashboard/recipes"/>} icon={<FaQrcode />} className={`${pathname === '/dashboard/recipes'? "active": null}`}>Recipes</MenuItem>
        
        {userData?.userGroup == 'SystemUser' ?
         <MenuItem component={<Link to="/dashboard/favorite"/>}
          icon={<MdFavoriteBorder size="20" />} className={`${pathname === '/dashboard/favorite'? "active": null}`}>
            Favorites
          </MenuItem> : ''
        }

        {userData?.userGroup != 'SystemUser' ?
        <MenuItem component={<Link to="/dashboard/categories"/>}
         icon={<LuCalendarDays />} className={`${pathname === '/dashboard/categories'? "active": null}`}>
          Categories
        </MenuItem> : ''
        }
        
        <MenuItem component={<Link to="/dashboard/change-pass" />} icon={<FaUnlockAlt />}>Change Password</MenuItem>
        <MenuItem onClick={handleLogout} icon={<IoLogOut />}>Logout</MenuItem>
      </Menu>
    </Sidebar>
    </div>
      
      
    </>
  )
}
