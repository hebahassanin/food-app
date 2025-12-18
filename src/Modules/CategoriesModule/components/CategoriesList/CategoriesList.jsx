import React, { useEffect } from 'react'
import Header from '../../../Shared/components/Header/Header'
import headerImg1 from '../../../../assets/images/headerImgs/header1.svg'
import axios from 'axios'
import { useState } from 'react'
import NoData from '../../../Shared/components/NoData/NoData';
import DotLoader from 'react-spinners/DotLoader';
import { MdMoreHoriz } from "react-icons/md";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function CategoriesList() {

  const [categoriesList,setCategoriesList]= useState([]);
  const [loading, setLoading] = useState(false);

  const getAllCategories =async()=>{
    try {
      setLoading(true);
      let response = await axios.get('https://upskilling-egypt.com:3006/api/v1/Category/?pageSize=10&pageNumber=1',
      {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
      // console.log(response.data.data);
      setCategoriesList(response?.data?.data);
      
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }


  }

  useEffect(()=>{
    getAllCategories();

  },[])

  const deleteCategory =async(id)=>{
    try {
      let response = await axios.delete(`https://upskilling-egypt.com:3006/api/v1/Category/${id}`,
      {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
      getAllCategories();
      
    } catch (error) {
      console.log(error);
      
    }
  }


  return (
    <>
    <Header title={'Categories Item'} description={'You can now add your items that any user can order it from the Application and you can edit'} imgUrl={headerImg1}/>

    <div className="categories-container m-3 d-flex justify-content-between align-items-center p-4">
      <div className="caption">
        <h4>Categories Table Details</h4>
        <p>You can check all details</p>
      </div>
      <button className='btn btn-success'>Add New Category</button>
    </div>
      
      <div className="table-container p-3 m-3">

      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Category Name</th>
            <th scope="col">Creation Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          { loading ?(
            <tr>
              <td colSpan="4" className='text-center py-4'>
              <div className='d-flex justify-content-center align-items-center'>
              <DotLoader color="#0b4f0b" />
              </div>

              </td>
            </tr>
          )        
          :categoriesList.length >0 ?  categoriesList.map(category=>(
            <tr key={category?.id}>
            <th scope="row">{category?.id}</th>
            <td>{category?.name}</td>
            <td>{category?.creationDate.split("T")[0]}</td>

            <td>
            <div className="dropdown">
              <button
                className="btn p-0 border-0"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <MdMoreHoriz size={20} />
              </button>

              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2">
                    <FaEye /> View
                  </button>
                </li>

                <li>
                  <button className="dropdown-item d-flex align-items-center gap-2">
                    <FaEdit /> Edit
                  </button>
                </li>

                <li>
                  <button onClick={()=>deleteCategory(category?.id)} className="dropdown-item text-success d-flex align-items-center gap-2">
                    <FaTrash  className='text-success'/> Delete
                  </button>
                </li>
              </ul>
            </div>
          </td>



          </tr>
          )) : <NoData/>}
        </tbody>
      </table>


      </div>
    </>
  )
}
