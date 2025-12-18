import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CiMobile2 } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useContext } from 'react';
import { AuthContext} from '../../../../context/AuthContext';

export default function Login() {

  let {register,formState:{errors},handleSubmit} =useForm();
  let navigate= useNavigate();

  // Show and hide password with icon
  const [showPassword, setShowPassword]=useState(false);

  let {saveUserData}= useContext(AuthContext);


  const onSubmit =async(data)=>{
    try {
      let response = await axios.post('https://upskilling-egypt.com:3006/api/v1/Users/Login',data);
      localStorage.setItem("token",response?.data?.token);
      saveUserData();

      toast.success('Wow logged successfully!',
      {
        autoClose: 3000,
      })
      navigate('/dashboard');
      
    } catch (error) {
      toast.error(error.response?.data?.message,
        {
          autoClose: 3000,
        });
    }
  }

  
  return (
    <>
      <div className="title mb-3">
        <h4 className='fw-bold'>Log In</h4>
        <p className='text-muted'>Welcome Back! Please enter your details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><CiMobile2 size={18}/></span>
        <input type="text"
        {...register('email',{required:'email is required',
        pattern:{
          value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          message:"should be valid mail"
        }
        })}
         className="form-control" placeholder="Enter Your E-mail" aria-label="email" aria-describedby="basic-addon1"/>
      </div>
      {errors.email && <div className='alert alert-danger p-2'>{errors.email.message}</div>}

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
        <input type={showPassword ? "text" :"password"}
        {...register('password',{required:'password is required' })}
         className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1"/>
         <span className="input-group-text" onClick={()=>setShowPassword(!showPassword)} 
                style={{cursor:"pointer"}}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
      </div>
      {errors.password && <div className='alert alert-danger p-2'>{errors.password.message}</div>}

      <div className="links d-flex justify-content-between my-3">
        <Link className='text-decoration-none text-dark' to="/register">Register Now?</Link>
        <Link className='text-decoration-none green-color' to="/forget-pass">Forget Password</Link>
      </div>

      <button className='btn button-bg text-white  fs-5 fw-bold w-100 py-2'>Login</button>

      </form>
    </>
  )
}
