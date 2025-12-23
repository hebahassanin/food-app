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

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);

  // loading
  const [isloading, setIsLoading] = useState(true);

  // to disable button after delete to prevent click again on button
  const [isDeleting, setIsDeleting] = useState(false);


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
  const getAllUsers =async()=>{
    try {
      setIsLoading(true);
      let response = await axios.get('https://upskilling-egypt.com:3006/api/v1/Users/?pageSize=10&pageNumber=1',
      {headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
      // console.log(response?.data?.data);
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
      let response = await axios.delete(`https://upskilling-egypt.com:3006/api/v1/Users/${currentUserId}`,
      {headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}}
      );
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

  useEffect(()=>{
    getAllUsers();

  },[])

  return (
    <>
      <Header title={'Users List'} description={'You can now add your items that any user can order it from the Application and you can edit'}
      imgUrl={headerImg1}/>

      <div className='m-4 py-2'>
        <h5 className='fw-bold'>Users Table Details</h5>
        <p>You can check all details</p>
      </div>

      {/*  Modal to delete User*/}
      <Modal show={showFormModal} onHide={()=> setShowFormModal(false)}>
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

      {isloading ?(
        <div className='d-flex justify-content-center align-items-center py-5'>
        <DotLoader color="#0b4f0b" />
        </div>

      ):usersList.length>0?(
        <table className="table table-striped">
        <thead className='table-secondary'>
          <tr>
            <th scope="col">#</th>
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
            <td><img style={{height:"40px",width:"50px",borderRadius:"6px",objectFit:"cover"}} src={user?.imagePath ? user?.imagePath: userImage} alt="image"/></td>
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
                  <button className="dropdown-item text-success d-flex align-items-center gap-2">
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

      ):(<NoData/>)}

    </>
  )
}
