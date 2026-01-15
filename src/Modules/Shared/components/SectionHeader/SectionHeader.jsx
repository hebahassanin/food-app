import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

export default function SectionHeader({title,subtitle,buttonText, onButtonClick}) {
  return (
    <>
        <div className="home-container m-0 m-md-3 d-flex flex-column flex-sm-row justify-content-between align-items-center p-md-4 p-2 rounded-3">
        <div className="caption">
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </div>
        <button onClick={onButtonClick} className='btn btnColor text-white mx-auto mx-md-0'>{buttonText} <FaArrowRightLong className='ms-2'/></button>
      </div>
      
    </>
  )
}
