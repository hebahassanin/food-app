import React from 'react'
import { useForm } from 'react-hook-form'
import { CiMobile2 } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../../Services/END_POINTS.JS';
import { USERS_URL } from '../../../../Services/END_POINTS.JS';

export default function ResetPassword() {

  let {register,formState:{errors},handleSubmit,watch}=useForm();
  let navigate= useNavigate();

  // to receive state(email) from forgetPassword page
  let location = useLocation();
  let passedEmail = location.state?.email || "";

   // Show and hide password with icon
   const [showPassword, setShowPassword]=useState(false);
   let [showConfirmPassword,setShowConfirmPassword]= useState(false);

   // use watch to compare NewPassword and ConfirmPassword to checked matching or not .
   let password= watch("password");

  const onSubmit =async(data)=>{

    try {
      let response = await axiosInstance.post(USERS_URL.RESET_PASS,data);
      console.log(response);
      toast.success(response.data.message)
      navigate('/login');
      
    } catch (error) {
      toast.error(error.response.data.message);
    }

  }

  return (
    <>
      <div className="title mb-3">
        <h4 className='fw-bold'>Reset Password</h4>
        <p className='text-muted'>Please Enter Your Otp or Check Your Inbox</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><CiMobile2 size={18}/></span>
        <input type="text" readOnly defaultValue={passedEmail}
         {...register('email',{required:'email is required',
         pattern:{
           value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
           message:"should be valid mail"
         }
         })}
         className="form-control" placeholder="Email" aria-label="email" aria-describedby="basic-addon1"/>
      </div>
      {errors.email && <div className='alert alert-danger p-2'>{errors.email.message}</div>}

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
        <input type="text" className="form-control" placeholder="OTP" aria-label="seed" aria-describedby="basic-addon1"
        {...register('seed',{required:"Otp is required"})}
        />
      </div>
      {errors.seed && <div className='alert alert-danger p-2'>{errors.seed.message}</div>}


      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
        <input type={showPassword ? "text" :"password"}
        {...register('password',{required:'password is required' })}
         className="form-control" placeholder="New Password" aria-label="Password" aria-describedby="basic-addon1"/>
         <span className="input-group-text" onClick={()=>setShowPassword(!showPassword)} 
                style={{cursor:"pointer"}}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
      </div>
      {errors.password && <div className='alert alert-danger p-2'>{errors.password.message}</div>}


      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
        <input type={showConfirmPassword ? "text" :"password"}
        {...register('confirmPassword',{required:'password is required' ,
          validate: value => value === password || "Password do not match"
      })}
         className="form-control" placeholder="Confirm New Password" aria-label="confirmPassword" aria-describedby="basic-addon1"/>
         <span className="input-group-text" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} 
                style={{cursor:"pointer"}}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
      </div>
      {errors.confirmPassword && <div className='alert alert-danger p-2'>{errors.confirmPassword.message}</div>}

      <button className='btn button-bg text-white  fs-5 fw-bold w-100 py-2 mt-2'>Reset Password</button>
      
      </form>


    </>
  )
}
