import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../../../context/AuthContext'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {
    const {userData}= useContext(AuthContext);

    if(localStorage.getItem('token') || userData)
      return children;
    else
      return <Navigate to='/'/>
}
