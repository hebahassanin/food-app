import React from 'react'
import Header from '../../../Shared/components/Header/Header'
import headerImg from '../../../../assets/images/headerImgs/header.png'
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate =useNavigate();
  return (
    <>
      <Header title={'Welcome Upskilling !'} description={'This is a welcoming screen for the entry of the application , you can now see the options'} imgUrl={headerImg}/>

      <div className="home-container m-3 d-flex justify-content-between align-items-center p-4 rounded-3">
        <div className="caption">
          <h4>Fill The Recipes !</h4>
          <p>you can now fill the meals easily using the table and form , click here and sill it with the table !</p>
        </div>
        <button onClick={()=> navigate('/dashboard/recipes')} className='btn btnColor text-white'>Fill Recipes <FaArrowRightLong /></button>
      </div>
    </>
  )
}
