import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

export default function SectionHeader({title,subtitle,buttonText, onButtonClick}) {
  return (
    <>
        <div className="home-container m-3 d-flex justify-content-between align-items-center p-4 rounded-3">
        <div className="caption">
          <h4>{title}</h4>
          <p>{subtitle}</p>
        </div>
        <button onClick={onButtonClick} className='btn btnColor text-white'>{buttonText} <FaArrowRightLong className='ms-2'/></button>
      </div>
      
    </>
  )
}
