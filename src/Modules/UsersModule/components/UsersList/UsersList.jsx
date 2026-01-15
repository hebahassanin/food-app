import React from 'react'
import Header from '../../../Shared/components/Header/Header'
import headerImg1 from '../../../../assets/images/headerImgs/header1.svg'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import userImage from '../../../../assets/images/userImg.avif';
import { FaEye, FaTrash } from "react-icons/fa";
import DotLoader from 'react-spinners/DotLoader';
import { MdMoreHoriz } from "react-icons/md";
import NoData from '../../../Shared/components/NoData/NoData'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DeleteConfirmation from '../../../Shared/components/DeleteConfirmation/DeleteConfirmation'
import { toast } from 'react-toastify'
import { axiosInstance } from '../../../../Services/END_POINTS.JS'
import { USERS_URL } from '../../../../Services/END_POINTS.JS'
import { IoIosSearch } from "react-icons/io";

export default function UsersList() {

  const [usersList, setUsersList] = useState([]);

  // state to store userName and Role group to use it in search
  const[nameValue, setNameValue]= useState("");
  const [groupValue,setGroupValue]= useState("");

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


  // loading
  const [isloading, setIsLoading] = useState(true);

  // to disable button after delete to prevent click again on button
  const [isDeleting, setIsDeleting] = useState(false);

  const [isCentered, setIsCentered] = useState(false);


  // view Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewUser = (User) => {
    setSelectedUser(User);
    setShowViewModal(true);
};

  // Delete Modal
  const[showFormModal, setShowFormModal]= useState(false);
  const [currentUserId,setCurrentUserId] = useState(null);
  const[userName,setUserName]= useState('');

  const handleDeleteShow=(user)=>{
    setCurrentUserId(user.id);
    setUserName(user.userName);
    setShowFormModal(true);
  }



  // getAllUsers
  const getAllUsers =async(pageNo, pageSize, name,role)=>{
    try {
      setIsLoading(true);
      let response = await axiosInstance.get(USERS_URL.GET_USERS,{
        params:{
          pageSize: pageSize,
          pageNumber: pageNo,
          userName: name,
          groups: role,
        }, headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}

      });
      console.log(response?.data?.data);
      setArrayOfPages(Array(response.data.totalNumberOfPages).fill().map((_,i)=> i+1));

      setUsersList(response?.data?.data);
      
    } catch (error) {
      console.log(error);
      
    }finally{
      setIsLoading(false);
    }
  }

  // Delete User
  const deleteUser =async()=>{
    try {
      setIsDeleting(true);
      let response = await axiosInstance.delete(USERS_URL.DELETE_USERS(currentUserId),
      { headers: {Authorization:`Bearer ${localStorage.getItem('token')}`} });
      setShowFormModal(false);
      toast.success("User deleted successfully",{autoClose: 3000})
      getAllUsers();
    } catch (error) {
      // console.log(error);
      toast.error('Failed to delete User',{autoClose:3000});
      
    }finally{
      setIsDeleting(false);
    }
  }

  const getNameValue=(input)=>{
    setNameValue(input.target.value);
    setCurrentPage(1);
    getAllUsers(1, pageSize,input.target.value, groupValue);

  }

  const getGroupValue=(input)=>{
    setGroupValue(input.target.value);
    setCurrentPage(1);
    getAllUsers(1, pageSize,nameValue,input.target.value);
  }

  useEffect(()=>{
    getAllUsers(currentPage, pageSize);
  },[currentPage]);

  useEffect(()=>{

      // to know size of window
      const handleResize = () => {
        // لو الشاشة >= 768px (md) خلي المودال centered، لو أصغر خلي top
        setIsCentered(window.innerWidth >= 768);
      };
    
      handleResize(); // عشان نحدد أول مرة
    
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize',handleResize);

  },[])

  return (
    <>
      <Header title={'Users List'} description={'You can now add your items that any user can order it from the Application and you can edit'}
      imgUrl={headerImg1}/>

      <div className='m-4 py-2'>
        <h5 className='fw-bold'>Users Table Details</h5>
        <p>You can check all details</p>
      </div>

      {/* view user in modal */}
      <Modal
      show={showViewModal}
      onHide={() => setShowViewModal(false)}
      centered dialogClassName="small-view-modal">
      <Modal.Header  style={{
       background: 'linear-gradient(90deg, #009247, #fff)',color:"#fff"}} closeButton>
        <Modal.Title>User Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {selectedUser && (
          <div className="shadow-sm user-page">
            <div className='d-flex justify-content-center mb-3'>
              <img
                src={
                  selectedUser.imagePath
                    ? `https://upskilling-egypt.com:3006/${selectedUser?.imagePath}`
                    : userImage
                }
              
                alt={selectedUser.name}
                style={{ height: '80px',borderRadius:"50%" ,objectFit: 'cover' }}
              />
            </div>
                
            <div className="py-2 px-2">
              <h6 className="mb-3">
                <strong>User Name:</strong> {selectedUser?.userName}
              </h6>

              <h6 className="mb-3">
                <strong>Email:</strong> {selectedUser?.email}
              </h6>
              <h6 className="mb-3">
              <strong>Country:</strong> {selectedUser?.country}
              </h6>

              <h6 className="mb-3">
                <strong>Phone Number:</strong> {selectedUser?.phoneNumber}
              </h6>

              <h6 className="mb-3">
                <strong>Role:</strong> {selectedUser?.group?.name}
              </h6>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>

      {/*  Modal to delete User*/}
      <Modal show={showFormModal} onHide={()=> setShowFormModal(false)} centered={isCentered}
      dialogClassName={`small-delete-modal ${!isCentered ? "mobile-modal" : ""}`} size={isCentered? "md":"sm"}>
      <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <DeleteConfirmation deleteItem={'user'} name={userName}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" disabled={isDeleting} onClick={deleteUser}
          className='d-flex align-items-center gap-2'>
           {isDeleting ? (
           <> 
           Deleting 
           <span className='spinner-border spinner-border-sm' role='status' aria-hidden='true'/>
           </>
           ):('Delete this item')} 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search by userName and group */}
      <div className='row align-items-center g-3 my-4 mx-2'>
      <div className='col-12 col-sm-6 col-md-4'>
        <div className="input-group">
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

      <div className='col-6 col-sm-6 col-md-3'>
        <select className="form-select" onChange={getGroupValue}  aria-label="Small select example">
          <option value="" disabled selected>Groups</option>
          <option value="1">group admin</option>
          <option value="2"> system user</option>
          </select>
      </div>
    </div>

      {isloading ?(
        <div className='d-flex justify-content-center align-items-center py-5'>
        <DotLoader color="#0b4f0b" />
        </div>

      ):usersList.length>0?(
        <div class="container-fluid px-3 my-3">
          <div className='table-resposive d-none d-lg-block'>
            <table className="table table-striped w-100">
            <thead className='table-secondary custom-thead'>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">User Name</th>
                <th scope="col">User Image</th>
                <th scope="col">Email</th>
                <th scope="col">Country</th>
                <th scope="col">Phone Number</th>
                <th scope="col">Role</th>
                <th scope="col">actions</th>

              </tr>
            </thead>
            <tbody>
            {usersList.map(user =>(
                <tr key={user?.id}>
                <th scope="row">{user?.id}</th>
                <td>{user?.userName}</td>
                <td><img style={{height:"40px",width:"50px",borderRadius:"6px",objectFit:"cover"}} 
                src={user?.imagePath ? `https://upskilling-egypt.com:3006/${user?.imagePath}`: userImage} alt="image"/></td>
                <td>{user?.email}</td>
                <td>{user?.country}</td>
                <td>{user?.phoneNumber}</td>
                <td>{user?.group?.name}</td>
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
                      onClick={()=>handleViewUser(user)}>
                        <FaEye /> View
                      </button>
                    </li>

                    <li>
                      <button onClick={()=>handleDeleteShow(user)}  className="dropdown-item text-danger d-flex align-items-center gap-2">
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
  {usersList.length > 0 ? (
    usersList.map(user => (
      <div key={user.id} className='col-12 col-sm-6 col-md-4'>
      <div className="card h-100 shadow-sm">
        <div className="card-body py-4">
          <img className="card-img-top d-block mx-auto" style={{height:"80px",width:"70px",borderRadius:"6px",objectFit:"cover"}} 
          src={user?.imagePath ? `https://upskilling-egypt.com:3006/${user?.imagePath}`: userImage} alt="image"/>
          <p className="card-title mt-3"><strong>userName: </strong> {user?.userName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Country:</strong> {user?.country}</p>
            <p><strong>phoneNumber:</strong> {user?.phoneNumber}</p>
            <p><strong>Role:</strong> {user?.group?.name}</p>

          <div className="d-flex justify-content-center my-3 card-actions">
            <button className="btn btn-outline-success btn-sm" onClick={()=>handleViewUser(user)}>
              <FaEye />
            </button>
            <button onClick={()=> handleDeleteShow(user)} className="btn btn-outline-danger btn-sm mx-3">
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
