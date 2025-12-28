import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import { FaRegEnvelope } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../../Services/END_POINTS.JS';
import { USERS_URL } from '../../../../Services/END_POINTS.JS';

export default function VerifyAccount() {
  let {register,formState:{errors},handleSubmit}=useForm();
  let navigate = useNavigate();

   // to receive state(email) from register page
  let location = useLocation();
  let passedEmail = location.state?.email || "";

  let onSubmit =async(data)=>{
    try {
      let response = await axiosInstance.put(USERS_URL.VERIFY,data);
      toast.success('Account verified successfully');
      navigate('/');

      
    } catch (error) {
      toast.error("Verification failed, please try again");
      
    }
    

  }

  return (
    <>
      <div className="title mt-2">
        <h4 className='fw-bold'>Verify Account</h4>
        <p className='text-muted'>
          Please Enter Your Otp or Check Your Inbox
       </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
      <div className="input-group my-4">
          <span className="input-group-text" id="basic-addon1"><FaRegEnvelope /></span>
          <input type="text" readOnly defaultValue={passedEmail} className="form-control" placeholder="Enter Your E-mail" aria-label="email" aria-describedby="basic-addon1"
          {...register('email',{required:'email is required',
          pattern:{
            value:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message:"should be valid mail"
          }
        })}
          />
      </div>
      {errors.email && <div className='alert alert-danger p-2'>{errors.email.message}</div>}

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
          <input type="text" className="form-control" placeholder="OTP" aria-label="seed" aria-describedby="basic-addon1"
          {...register('code',{required:"Otp is required"})}
          />
      </div>
      {errors.code && <div className='alert alert-danger p-2'>{errors.code.message}</div>}

      <button className='btn button-bg text-white  fs-5 fw-bold w-100 py-2 mt-2'>Send</button>

      </form>
    </>
  )
}
