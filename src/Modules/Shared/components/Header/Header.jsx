import React from 'react'

export default function Header({title,description,imgUrl}) {

  
  return (
    <>
    <header className='bg-header m-2 rounded-3'>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-8 text-white">
            <div className='h-100 d-flex flex-column justify-content-center p-md-3 pt-4'>
              <h2 className='fw-bold header-title'>{title}</h2>
              <p className='header-desc'>{description}</p>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="h-100 text-end">
              <img className='w-75 header-image' src={imgUrl} alt=""/>
            </div>
          </div>
        </div>
      </div>
    </header>
      
    </>
  )
}
