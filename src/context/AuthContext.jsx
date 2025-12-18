import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';


export const AuthContext = createContext(null);

export default function AuthContextProvider ({children}){
    const [userData, setUserData] =useState(null);

    const saveUserData =()=>{
        const encodedToken = localStorage.getItem('token');

        if(encodedToken){
            const decodedToken = jwtDecode(encodedToken);
            // console.log(decodedToken);
            setUserData(decodedToken);
        }
      
    }

    const logoutUser =()=>{
        localStorage.removeItem('token');
        setUserData(null);
    }

    useEffect(()=>{
        if(localStorage.getItem('token')){
            saveUserData();
        }
       
       },[])
    return (
        <AuthContext.Provider value={{userData,saveUserData,logoutUser}}>{children}</AuthContext.Provider>
    );

}