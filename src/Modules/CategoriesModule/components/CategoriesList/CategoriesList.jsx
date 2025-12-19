import React, { useEffect } from 'react'
import Header from '../../../Shared/components/Header/Header'
import headerImg1 from '../../../../assets/images/headerImgs/header1.svg'
import axios from 'axios'
import { useState } from 'react'
import NoData from '../../../Shared/components/NoData/NoData';
import DotLoader from 'react-spinners/DotLoader';
import { MdMoreHoriz } from "react-icons/md";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DeleteConfirmation from '../../../Shared/components/DeleteConfirmation/DeleteConfirmation'

export default function CategoriesList() {

  const [categoriesList,setCategoriesList]= useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryName, setCategoryName] = useState('');

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (category) => {
    setCategoryId(category.id);
    setCategoryName(category.name);
    setShow(true);
  }

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

  const deleteCategory =async()=>{
    try {
      let response = await axios.delete(`https://upskilling-egypt.com:3006/api/v1/Category/${categoryId}`,
      {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
      handleClose();
      getAllCategories();
      
      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
    getAllCategories();

  },[])


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

      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <DeleteConfirmation deleteItem={'Category'} name={categoryName}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={deleteCategory}>
            Delete this item
          </Button>
        </Modal.Footer>
      </Modal>
      
      { loading ?(
            
              <div className='d-flex justify-content-center align-items-center py-5'>
              <DotLoader color="#0b4f0b" />
              </div>

          )        
          :categoriesList.length >0 ?(
      <table className="table table-striped m-3">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Category Name</th>
            <th scope="col">Creation Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
           {categoriesList.map(category=>(
            <tr key={category?.id}>
            <th scope="row">{category?.id}</th>
            <td>{category?.name}</td>
            <td>{category?.creationDate?.split("T")[0]}</td>

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
                  <button className="dropdown-item text-success d-flex align-items-center gap-2">
                    <FaEye /> View
                  </button>
                </li>

                <li>
                  <button className="dropdown-item text-success d-flex align-items-center gap-2">
                    <FaEdit /> Edit
                  </button>
                </li>

                <li>
                  <button onClick={()=> handleShow(category)} className="dropdown-item text-success d-flex align-items-center gap-2">
                    <FaTrash/> Delete
                  </button>
                </li>
              </ul>
            </div>
          </td>
          </tr>
          ))} 
        </tbody>
      </table>
          ):(<NoData/>)}
    </>
  )
}
