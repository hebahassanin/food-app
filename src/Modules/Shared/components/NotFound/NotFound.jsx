import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../../assets/images/authImg/logo.png';
import notfound1 from '../../../../assets/images/notFound/notfound1.png';
import notfound2 from '../../../../assets/images/notFound/notfound2.png';

export default function NotFound() {
  return (
    <>
    <div className="container-fluid vh-100 py-4 px-5">
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      <div className=" d-flex align-items-center h-50 ms-5 mt-4">
        <div>
          <h2 className='fw-bolder fs-1'>Oops....</h2>
          <h4 className='text-success mb-4'>Page not found </h4>
          <p>This Page doesn't exist or was removed! <br/> We suggest you  back to home.</p>
          <Link className='btn btn-success text-white mt-3 py-2 w-100' to='/dashboard'><i className="fa-solid fa-arrow-left"></i> Back To Home</Link>
        </div>
      </div>

      <div className='notfound-bg'>
        <img src={notfound1} alt="notfound"/>
       
      </div>
      <div className='notfound-bg1'>
      <img  className="w-50"src={notfound2} alt="notfound"/>
      </div>
    </div>
    </>
  )
}
