import React, { useEffect } from 'react'
import Header from '../../../Shared/components/Header/Header'
import headerImg1 from '../../../../assets/images/headerImgs/header1.svg'
import axios from 'axios'
import { useState } from 'react'
import NoData from '../../../Shared/components/NoData/NoData';
import DotLoader from 'react-spinners/DotLoader';
import { MdMoreHoriz } from "react-icons/md";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
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

  const [nameValue, setNameValue]= useState("");

  
   //state to Pagination
   const[arrayOfPages, setArrayOfPages] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const pageSize= 10;

   const totalPages = arrayOfPages.length;
  const maxVisiblePages = 5;

  const getVisiblePages = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();



  const [loading, setLoading] = useState(false);

  // to disable button after delete to prevent click again on button
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  const [isCentered, setIsCentered] = useState(false);


  // view Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
};

  
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
  const getAllCategories =async(pageNo, pageSize,name)=>{
    try {
      setLoading(true);
      let response = await axios.get('https://upskilling-egypt.com:3006/api/v1/Category/',{
        params:{
          pageSize: pageSize,
          pageNumber: pageNo,
          name:name,
        }
      ,
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
      // console.log(response.data.data);
      
      setArrayOfPages(Array(response.data.totalNumberOfPages).fill().map((_,i)=> i+1));



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

   const getNameValue=(input)=>{
    setNameValue(input.target.value);
    setCurrentPage(1);
    // getAllCategories(1,pageSize, input.target.value);

  }

  useEffect(()=>{
    // getAllCategories();

    // to know size of window
    const handleResize = () => {
      // لو الشاشة >= 768px (md) خلي المودال centered، لو أصغر خلي top
      setIsCentered(window.innerWidth >= 768);
    };
  
    handleResize(); // عشان نحدد أول مرة
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize',handleResize);

  },[])

  useEffect(()=>{
    getAllCategories(currentPage, pageSize, nameValue);
  },[currentPage, nameValue]);


  return (
    <>
    <Header title={'Categories Item'} description={'You can now add your items that any user can order it from the Application and you can edit'} imgUrl={headerImg1}/>

    <div className="categories-container m-3 d-flex flex-column flex-sm-row justify-content-between align-items-center p-4">
      <div className="caption">
        <h4>Categories Table Details</h4>
        <p>You can check all details</p>
      </div>
      <button className='btn btn-success' onClick={handleAddShow}>Add New Category</button>
    </div>

    {/* view recipe in modal */}
    <Modal
      show={showViewModal}
      onHide={() => setShowViewModal(false)}
      centered dialogClassName="small-view-modal">
      <Modal.Header  style={{
       background: 'linear-gradient(90deg, #009247, #fff)',color:"#fff"}} closeButton>
        <Modal.Title>Category Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {selectedCategory && (
          <div className="shadow-sm category-page">
           
            <div className="py-2 px-2">
              <h6 className="mb-3">
                <strong>Category ID:</strong> {selectedCategory?.id}
              </h6>

              <h6 className="mb-3">
                <strong>Category Name:</strong> {selectedCategory?.name}
              </h6>
              <h6 className="mb-3">
              <strong>Creation Date:</strong> {selectedCategory?.creationDate?.split("T")[0]}
              </h6>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>


     {/*  Modal to delete Category*/}
      <Modal show={show} onHide={handleClose} centered={isCentered} 
      dialogClassName={!isCentered ? "mobile-modal" : ""} size={isCentered? "md":"sm"}>
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
      <Modal show={showFormModal} onHide={()=> setShowFormModal(false)} 
      centered={isCentered}  dialogClassName="small-category-modal">
      <Modal.Header style={ currentCategoryId? {
        background:'linear-gradient(90deg, #ffc107,#fff)', color:"#333"
      }
      :{ background: 'linear-gradient(90deg, #009247, #fff)',color:"#fff"}} closeButton>
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
          <Button variant={currentCategoryId?"warning":"success"} disabled={isSubmittingCategory} 
          onClick={submitCategory}>
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

    <div className='row my-3 mx-2'>
      <div className='col-12 col-sm-8 col-md-4'>
        <div className="input-group input-group-sm">
            <span className="input-group-text">
              <IoIosSearch />
            </span>
            <input
              type="search"
              className="form-control" 
              placeholder="Search by Name"
              onChange={getNameValue}
            />
        </div>
      </div>
    </div>
      
      { loading ?(
            
              <div className='d-flex justify-content-center align-items-center py-5'>
              <DotLoader color="#0b4f0b" />
              </div>

          )        
          :categoriesList.length >0 ?(
      <div className="container-fluid px-3 my-4">
      <div className='table-resposive d-none d-lg-block'>
      <table className="table table-striped w-100">
        <thead className=' custom-thead '>
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
                  <button className="dropdown-item text-success d-flex align-items-center gap-2"
                  onClick={()=>handleViewCategory(category)}>
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
      </div>
      </div>
          ):(<NoData/>)}


          {/* Cards (Mobile) */}
<div className="d-block d-lg-none m-3">
 <div className='container'>
    <div className='row g-3'>
  {categoriesList.length > 0 ? (
    categoriesList.map(category => (
      <div key={category.id} className='col-12 col-sm-6 col-md-4'>
       <div className="card h-100 shadow-sm">
        <div className="card-body py-4">
          <h3 className="card-title text-center"><strong>{category.name}</strong></h3>
          <p className="card-text mt-3"><strong>Creation Date:</strong> {category.creationDate?.split("T")[0]}</p>

          <div className="d-flex justify-content-center my-3">
            <button onClick={()=> handleViewCategory(category)} className="btn btn-outline-success btn-sm">
              <FaEye />
            </button>
            <button onClick={()=> handleEditShow(category)} className="btn btn-outline-warning btn-sm mx-3">
              <FaEdit />
            </button>
            <button onClick={()=> handleShow(category)} className="btn btn-outline-danger btn-sm">
              <FaTrash />
            </button>
          </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center">No category found</p>
  )}
</div>
</div>
</div>


 {/* Pagination */}

<nav className='mt-5'>
  <ul className="pagination justify-content-center">

    {/* Previous */}
    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={() => setCurrentPage(prev => prev - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
    </li>

    {/* First + ... */}
    {visiblePages[0] > 1 && (
      <>
        <li className="page-item">
          <button className="page-link" onClick={() => setCurrentPage(1)}>1</button>
        </li>
        <li className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      </>
    )}

    {/* Visible Pages */}
    {visiblePages.map(page => (
      <li
        key={page}
        className={`page-item ${currentPage === page ? "active" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      </li>
    ))}

    {/* ... + Last */}
    {visiblePages[visiblePages.length - 1] < totalPages && (
      <>
        <li className="page-item disabled">
          <span className="page-link">...</span>
        </li>
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      </>
    )}

    {/* Next */}
    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
      <button
        className="page-link"
        onClick={() => setCurrentPage(prev => prev + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </li>

  </ul>
</nav>



    </>
  )
}
