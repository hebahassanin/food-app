import React from 'react'
import { useForm } from 'react-hook-form'
import { TbLockPassword } from "react-icons/tb";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../../Services/END_POINTS.JS';
import { USERS_URL } from '../../../../Services/END_POINTS.JS';

export default function ChangePassword() {

  let{register,formState:{errors,isSubmitting},handleSubmit,watch}=useForm();

   // Show and hide password with icon
   const [showPassword, setShowPassword]=useState(false);
   const[showNewPassword, setShowNewPassword] = useState(false);
   let [showConfirmPassword,setShowConfirmPassword]= useState(false);
   let navigate=useNavigate();

  // use watch to compare NewPassword and ConfirmPassword to checked matching or not .
  let password= watch("newPassword");

  const onSubmit =async(data)=>{
    try {
      let response = await axiosInstance.put(USERS_URL.CHANG_PASS,data,
        {headers: {Authorization:` Bearer ${localStorage.getItem('token')}`}}
      );
      toast.success('Password has been updated successfully',{autoClose:2000});
      navigate('/dashboard');
      
    } catch (error) {
      toast.error('Falied to updated your password',{autoClose:2000});
      
    }
  }

  return (
    <>
      <div className="title m-5">
        <h4 className='fw-bold'>Change Password</h4>
        <p className='text-muted'>Change Password! Please enter your details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='m-5 w-75'>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
        <input type={showPassword ? "text" :"password"}
        {...register('oldPassword',{required:'password is required' })}
         className="form-control" placeholder="Enter Your Password" aria-label="oldPassword" aria-describedby="basic-addon1"/>
         <span className="input-group-text" onClick={()=>setShowPassword(!showPassword)} 
                style={{cursor:"pointer"}}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
      </div>
      {errors.oldPassword && <div className='alert alert-danger p-2'>{errors.oldPassword.message}</div>}



      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
        <input type={showNewPassword ? "text" :"password"}
        {...register('newPassword',{required:'password is required' })}
         className="form-control" placeholder="Enter Your New Password" aria-label="newPassword" aria-describedby="basic-addon1"/>
         <span className="input-group-text" onClick={()=>setShowNewPassword(!showNewPassword)} 
                style={{cursor:"pointer"}}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
      </div>
      {errors.newPassword && <div className='alert alert-danger p-2'>{errors.newPassword.message}</div>}


      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
        <input type={showConfirmPassword ? "text" :"password"}
        {...register('confirmNewPassword',{required:'password is required' ,
          validate: value => value === password || "Password do not match"
      })}
         className="form-control" placeholder="Confirm Your New Password" aria-label="confirmPassword" aria-describedby="basic-addon1"/>
         <span className="input-group-text" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} 
                style={{cursor:"pointer"}}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
      </div>
      {errors.confirmNewPassword && <div className='alert alert-danger p-2'>{errors.confirmNewPassword.message}</div>}

      <button disabled={isSubmitting} className='btn button-bg text-white  fs-5 fw-bold w-100 py-2 mt-2'>
        {isSubmitting ?(
          <>
          Change Password
          <span className='spinner-border spinner-border-sm ms-2' role='status' aria-hidden='true'/>
          </>
        ):(' Change Password')}
       </button>
      
    </form>
    </>
  )
}
