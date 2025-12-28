import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import { CiMobile2 } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../../Services/END_POINTS.JS';
import { USERS_URL } from '../../../../Services/END_POINTS.JS';

export default function ForgetPassword() {

  let {register,formState:{errors},handleSubmit}= useForm();
  let navigate= useNavigate();

  const onSubmit=async(data)=>{
   try {
    let response = await axiosInstance.post(USERS_URL.FORGET_PASS,data);
    console.log(response);
    toast.success(response?.data?.message);
    navigate('/reset-pass', {state: {email: data.email}});

    
   } catch (error) {
    toast.error(error.response.data.message);
    
   }

  }
  return (
    <>
      <div className="title mt-2">
        <h4 className='fw-bold'>Forgot Your Password?</h4>
        <p className='text-muted'>No worries! Please enter your email 
        and we will send a password reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group my-5">
          <span className="input-group-text" id="basic-addon1"><CiMobile2 size={18}/></span>
          <input type="text" className="form-control" placeholder="Enter Your E-mail" aria-label="email" aria-describedby="basic-addon1"
          {...register('email',{required:'email is required',
          pattern:{
            value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message:"should be valid mail"
          }
        })}
          />
        </div>
        {errors.email && <div className='alert alert-danger p-2'>{errors.email.message}</div>}

        <button className='btn button-bg text-white fs-5 fw-bold w-100 py-2'>Submit</button>
      </form>

      
    </>
  )
}
