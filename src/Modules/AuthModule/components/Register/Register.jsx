import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { CiMobile2 } from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  let {register, formState:{errors},handleSubmit, watch}= useForm();
  let navigate = useNavigate();

  // Show and hide password with icon
  const [showPassword, setShowPassword]=useState(false);
  let [showConfirmPassword,setShowConfirmPassword]= useState(false);
  const password = watch("password");

  const onSubmit=async(data)=>{
    try {
      let response = await axios.post('https://upskilling-egypt.com:3006/api/v1/Users/Register',data)
      toast.success('Create User successfully!');
      // console.log(data);
      navigate('/verify-account',{state:{email:data.email}});
      
    } catch (error) {
      toast.error('Faild to create account');
    }
    
  }

  return (
    <>
      <div className="title mb-4">
        <h4 className='fw-bold'>Register</h4>
        <p className='text-muted'>Welcome Back! Please enter your details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row my-2">
          <div className="col-md-6">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1"><CiMobile2 size={18}/></span>
            <input type="text" className="form-control" placeholder="UserName" aria-label="Username" 
            aria-describedby="basic-addon1"
            {...register('userName',{required:"User Name is required",
            pattern:{
              value: /^[A-Za-z]+[0-9]+$/,
              message: "The userName must contain characters and end with numbers without spaces"
            }
          })}
            />
          </div>
          {errors.userName && <div className='alert alert-danger p-2'>{errors.userName.message}</div>}
          </div>

          <div className="col-md-6">
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
            </div>
          </div>

        <div className="row my-2">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
              <input type="text" className="form-control" placeholder="Country" aria-label="Country" 
              aria-describedby="basic-addon1"
              {...register('country',{required:'Country is required'})}
              />
            </div>
            {errors.country && <div className='alert alert-danger p-2'>{errors.country.message}</div>}
          </div>

          <div className="col-md-6">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1"><CiMobile2 size={18}/></span>
            <input type="number" className="form-control" placeholder="PhoneNumber" aria-label="PhoneNumber" 
            aria-describedby="basic-addon1"
            {...register('phoneNumber',{required:'Phone Number is required'})}
            />
          </div>
          {errors.phoneNumber && <div className='alert alert-danger p-2'>{errors.phoneNumber.message}</div>}
          </div>
        </div>

        <div className="row mb-2">
          <div className="col-md-6">
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
          </div>

        <div className="col-md-6">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1"><TbLockPassword size={18}/></span>
            <input type={showConfirmPassword ? "text" :"password"}
            {...register('confirmPassword',{required:'password is required' ,
              validate: value => value === password || "Password do not match"
           })}
            className="form-control" placeholder="Confirm-Password" aria-label="confirmPassword" aria-describedby="basic-addon1"/>
            <span className="input-group-text" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} 
                    style={{cursor:"pointer"}}>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
          </div>
          {errors.confirmPassword && <div className='alert alert-danger p-2'>{errors.confirmPassword.message}</div>}
        </div>

        </div>

        <div className="d-flex justify-content-end">
            <Link className='text-decoration-none green-color' to="/login">Login Now?</Link>
        </div>

        <button className='btn button-bg text-white  fs-5 fw-bold w-100 py-2 mt-3'>Register</button>
      </form>
    </>
  )
}
