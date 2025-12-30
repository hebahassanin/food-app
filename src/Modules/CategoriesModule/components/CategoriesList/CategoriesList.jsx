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
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AuthContext } from '../../../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CategoriesList() {

  let {logoutUser,userData}= useContext(AuthContext);
  let navigate = useNavigate();

  const [categoriesList,setCategoriesList]= useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [categoryName, setCategoryName] = useState('');

  const [loading, setLoading] = useState(false);

  // to disable button after delete to prevent click again on button
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  
  // Delete Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (category) => {
    setCategoryId(category.id);
    setCategoryName(category.name);
    setShow(true);
  }


  // Add and update Modal
  const [showFormModal, setShowFormModal] = useState(false);

  const[currentCategoryId,setCurrentCategoryId]= useState(null);
  const [categoryValue, setCategoryValue] = useState('');

  // Update Modal
  const handleEditShow = (category) => {
    setCurrentCategoryId(category.id);
    setCategoryValue(category.name); 
    setShowFormModal(true);         
  };

  // Add Model
  const handleAddShow = () => {
    setCurrentCategoryId(null);
    setCategoryValue('');
    setShowFormModal(true);
  }


  //  getAllCategories
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

  // Add and Update Category
  const submitCategory =async()=>{

    setIsSubmittingCategory(true);

    // Update Category
    if(currentCategoryId){
      try {
        await axios.put(`https://upskilling-egypt.com:3006/api/v1/Category/${currentCategoryId}`,{name: categoryValue},
        {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
        );
        
        setShowFormModal(false);
        toast.success("Category updated successfully",{autoClose: 3000})
        setCategoryValue('');
        setCurrentCategoryId(null);
        getAllCategories();
        
      } catch (error) {
        // console.log(error);
        toast.error("Failed to updated Category");
      }finally{
        setIsSubmittingCategory(false)
      }

    }else{

      // Add Category
      try {
        await axios.post('https://upskilling-egypt.com:3006/api/v1/Category/',{name: categoryValue},
        {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
        );
        setShowFormModal(false);
        toast.success("Category created successfully",{autoClose: 3000})
        setCategoryValue('');
        setCurrentCategoryId(null);
        getAllCategories();
        
      } catch (error) {
        // console.log(error);
        toast.error("Failed to Create Category",{autoClose: 3000});  
      }finally{
        setIsSubmittingCategory(false);
      }
    }
   
  }

 // deleteCategory
  const deleteCategory =async()=>{
    try {
      setIsDeleting(true);
      let response = await axios.delete(`https://upskilling-egypt.com:3006/api/v1/Category/${categoryId}`,
      {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
      handleClose();
      toast.success("Category deleted successfully",{autoClose: 3000})
      getAllCategories();
    } catch (error) {
      // console.log(error);
      toast.error('Failed to delete Category',{autoClose:3000});
    }finally{
      setIsDeleting(false);
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
      <button className='btn btn-success' onClick={handleAddShow}>Add New Category</button>
    </div>


     {/*  Modal to delete Category*/}
      <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <DeleteConfirmation deleteItem={'Category'} name={categoryName}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger"  disabled={isDeleting} onClick={deleteCategory}>
          {isDeleting ? (
           <> 
           Deleting 
           <span className='spinner-border spinner-border-sm ms-2' role='status' aria-hidden='true'/>
           </>
           ):('Delete this item')} 
          </Button>
        </Modal.Footer>
      </Modal>

    {/*-------Modal to Add Or Update Category--- */}
      <Modal show={showFormModal} onHide={()=> setShowFormModal(false)} centered>
      <Modal.Header closeButton>
          <Modal.Title>{currentCategoryId ? "Update Category":"Add Category"}</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
        <Form>
            <Form.Control
              type="text"
              placeholder="Category Name"
              value={categoryValue}
              onChange={(e)=> setCategoryValue(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" disabled={isSubmittingCategory} onClick={submitCategory}>
          {isSubmittingCategory ?(
            <>
            {currentCategoryId ? "Updating...":"Adding..."}
            <span className='spinner-border spinner-border-sm ms-2'/>
            </>
          ):(
            currentCategoryId ? "Update Category":"Add Category"
          )}
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
        <thead className='table-secondary'>
          <tr>
            <th scope="col">ID</th>
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
                  <button onClick={()=> handleEditShow(category)} className="dropdown-item text-warning d-flex align-items-center gap-2">
                    <FaEdit /> Edit
                  </button>
                </li>

                <li>
                  <button onClick={()=> handleShow(category)} className="dropdown-item text-danger d-flex align-items-center gap-2">
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
