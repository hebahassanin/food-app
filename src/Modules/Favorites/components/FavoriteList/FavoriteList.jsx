import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../../../context/AuthContext'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { axiosInstance } from '../../../../Services/END_POINTS.JS';
import { USER_RECIPE_URLS } from '../../../../Services/END_POINTS.JS';
import recipeImg from '../../../../assets/images/recipeImage.jpg';
import { ImageURL } from '../../../../Services/END_POINTS.JS';
import NoData from '../../../Shared/components/NoData/NoData';
import { FaHeart } from "react-icons/fa";
import DotLoader from 'react-spinners/DotLoader';
import Header from '../../../Shared/components/Header/Header';
import headerImg1 from '../../../../assets/images/headerImgs/header1.svg';
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DeleteConfirmation from '../../../Shared/components/DeleteConfirmation/DeleteConfirmation';

export default function FavoriteList() {

  const [favList, setFavList] = useState([]);
  const [loading, setLoading] = useState(false);

    let {logoutUser,userData}= useContext(AuthContext);
    let navigate = useNavigate();

    const [favName, setFavName] = useState('');
    const [selectedFav, setSelectedFav] = useState(null);

    // to disable button after delete to prevent click again on button
  const [isDeleting, setIsDeleting] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (fav) => {
    setSelectedFav(fav);
    setFavName(fav.recipe.name);
    setShow(true);
  }


    // get Favorites
    const getAllFavorites =async()=>{
      try {
        setLoading(true);
        let response = await axiosInstance.get(USER_RECIPE_URLS.GET_FAVS,
          {
            params:{
              pageSize: 10,
              pageNumber:1
            }
          });
      console.log(response.data.data);
  
      setFavList(response?.data?.data);
        
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }

    // remove favorite
    let removeFavorite= async()=>{
      try {
        setIsDeleting(true);
        let response = await axiosInstance.delete(USER_RECIPE_URLS.DELETE_FAVS(selectedFav.id));
        console.log(response);
        handleClose();
        toast.success('Remove from favorite',{autoClose: 2000})
        getAllFavorites();
        
      } catch (error) {
        toast.error('Failed to delete favorite',{autoClose: 2000})
      }finally{
        setIsDeleting(false);
      }

    }

    useEffect(()=>{
      if(!userData) return;
        if(userData?.userGroup != 'SystemUser'){
            logoutUser();
            navigate('/');
        } 

        getAllFavorites();
    },[userData])


  return (
    <>

    <Header title={"Favorite Items"} description={"You can now add your items that any user can order it from the Application and you can edit"} imgUrl={headerImg1}/>

    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <DeleteConfirmation deleteItem={'favorite'} name={favName}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" disabled={isDeleting} onClick={removeFavorite}>
          {isDeleting ? (
           <> 
           Deleting 
           <span className='spinner-border spinner-border-sm ms-2' role='status' aria-hidden='true'/>
           </>
           ):('Delete this item')} 
          </Button>
        </Modal.Footer>
      </Modal>

    {loading ?(
          <div className='d-flex justify-content-center align-items-center py-5'>
          <DotLoader color="#0b4f0b" />
          </div>
          )        
          :favList.length >0 ?(

          <div className="container">
            <div className="row">

            {favList.map(fav=>(

            <div className="col-md-4 mb-4" key={fav?.id}>
              <div className="card position-relative">
                <img  className="card-img-top" style={{height: '150px',width:'100%', objectFit:'cover', borderRadius:'6px'}}  
                src={fav?.recipe?.imagePath ?`${ImageURL}${fav?.recipe?.imagePath}`: recipeImg}
                  alt={fav?.recipe?.name}/>
                  <FaHeart style={{position:'absolute',top:'10px',right:'10px',fontSize:'1.5rem',cursor:'pointer',color:'red'}}  color='red' onClick={()=> handleShow(fav)} />
                <div className="card-body">
                  <h5 className="card-title">{fav?.recipe?.name}  </h5>
                  <p className="card-text">{fav?.recipe?.description} </p>
                </div>
              </div>
            </div>
            ))}
            </div>
          </div>
           
          
           
        ):(<NoData/>)}
       
    </>
  )
}
