import React from 'react'
import nodataImg from '../../../../assets/images/nodata.png';

export default function NoData() {
  return (
    <>
      <div className='d-flex justify-content-center align-items-center'>
        <img src={nodataImg} alt="noDataImg"/>
      </div>
    </>
  )
}
