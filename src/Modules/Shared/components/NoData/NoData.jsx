import React from 'react'
import nodataImg from '../../../../assets/images/nodata.png';

export default function NoData() {
  return (
    <>
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <img src={nodataImg} alt="noDataImg"/>
        <h4 className='mt-2'>No Data !</h4>
      </div>
    </>
  )
}
