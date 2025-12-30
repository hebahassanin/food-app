import React from 'react'
import Header from '../../../Shared/components/Header/Header'
import headerImg1 from '../../../../assets/images/headerImgs/header1.svg'
import { useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';

import { IoIosSearch } from "react-icons/io";
import DotLoader from 'react-spinners/DotLoader';

import { MdMoreHoriz } from "react-icons/md";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DeleteConfirmation from '../../../Shared/components/DeleteConfirmation/DeleteConfirmation'
import recipeImg from '../../../../assets/images/recipeImage.jpg';
import NoData from '../../../Shared/components/NoData/NoData';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../../Services/END_POINTS.JS';
import { RECIPES_URL } from '../../../../Services/END_POINTS.JS';
import { useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { USER_RECIPE_URLS } from '../../../../Services/END_POINTS.JS';

export default function RecipesList() {
  const {logoutUser,userData}= useContext(AuthContext);

  const [recipesList, setRecipesList] = useState([]);
  const [recipeId, setRecipeId] = useState(0);
  const [recipeName, setRecipeName] = useState('');
  const[favoriteRecipes, setFavoriteRecipes] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // to disable button after delete to prevent click again on button
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (recipe) => {
    setRecipeId(recipe.id);
    setRecipeName(recipe.name);
    setShow(true);
  }


  // Add favorite Modal
  const [showFormModal, setShowFormModal] = useState(false);
  const [favRecipeId, setFavRecipeId] = useState(null);
  const[favRecipeName, setFavRecipeName] = useState('');
  const handleAddfav=(recipe)=>{
    setFavRecipeId(recipe.id);
    setFavRecipeName(recipe.name);
    setShowFormModal(true);
  }


  //---- get Recipes-----
  const getAllRecipes =async()=>{
    try {
      setLoading(true);
      let response = await axiosInstance.get(RECIPES_URL.GET_RECIPES,{
        params:{
          pageSize: 10,
          pageNumber: 1
        }, headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}
      } 
    );
    console.log(response.data.data);

    setRecipesList(response.data.data);
      
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  }
  

 //Delete Recipe
  const deleteRecipe =async()=>{
    try {
      setIsDeleting(true);
      let response = await axiosInstance.delete(RECIPES_URL.DELETE_RECIPE(recipeId),
      {headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}} );
      handleClose();
      toast.success("Recipe deleted successfully",{autoClose: 3000})
      getAllRecipes();

    } catch (error) {
      // console.log(error);
      toast.error('Failed to delete Recipe',{autoClose:3000});
    }finally{
      setIsDeleting(false);
    }
  }

  // addToFavorite
  let addToFavorite=async(id)=>{
   try {
    setIsSubmitting(true)
    let response = await axiosInstance.post(USER_RECIPE_URLS.CREATE_FAVS,{'recipeId':id},
    {headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}})
    // console.log(response);
    setFavoriteRecipes(prev => [...prev, id]);
    setShowFormModal(false);
    toast.success('add to favorite successfuly',{autoClose: 2000});
    
   } catch (error) {
    toast.error('failed to add to favorite',{autoClose: 2000});
   }finally{
    setIsSubmitting(false);
  }
  }

  const getAllFavorites =async()=>{
    try {
      setLoading(true);
      let response = await axiosInstance.get(USER_RECIPE_URLS.GET_FAVS,
        {
          params:{
            pageSize: 10,
            pageNumber:1
          },headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}
        });
    
        const favIds = response.data.data.map(fav=> fav.recipe.id)

    setFavoriteRecipes(favIds);
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getAllRecipes();
    getAllFavorites();
  },[])

  return (
    <>
    <Header title={'Recipes Items'} description={'You can now add your items that any user can order it from the Application and you can edit'} imgUrl={headerImg1}/>
     
    <div className="recipes-container m-3 d-flex justify-content-between align-items-center p-4 rounded-3">
      <div className="caption">
        <h4>Recipe Table Details</h4>
        <p>You can check all details</p>
      </div>
      
      {userData?.userGroup != 'SystemUser' ?
      <button className='btn btn-success' onClick={()=> navigate('/dashboard/recipe-data')}>
        Add New Recipes
      </button> :''
      }
    </div>

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <DeleteConfirmation deleteItem={'Recipe'} name={recipeName}/>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" disabled={isDeleting} onClick={deleteRecipe}>
          {isDeleting ? (
           <> 
           Deleting 
           <span className='spinner-border spinner-border-sm ms-2' role='status' aria-hidden='true'/>
           </>
           ):('Delete this item')} 
          </Button>
        </Modal.Footer>
      </Modal>

      
      {/* Modal to add to favorite */}
      <Modal show={showFormModal} onHide={()=> setShowFormModal(false)} centered>
      <Modal.Header style={{
       background: 'linear-gradient(90deg, #fde2e4, #fff)'}} closeButton>
          <Modal.Title style={{color:"#842029"}} className='fw-bold'>Add To Favorites</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className='py-4'>
         <h6>Are you sure to add <strong>{favRecipeName}</strong> to favorite?</h6> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" disabled={isSubmitting} onClick={()=>addToFavorite(favRecipeId)}>
            {isSubmitting?
            <>Adding 
            <span className='spinner-border spinner-border-sm ms-2' role='status' aria-hidden='true'/>
            </>: 'add to favorite'}
           
          </Button>
        </Modal.Footer>
      </Modal>


    <div className='search-container d-flex align-items-center gap-3 m-3'>
        <div className="input-group">
          <span className="input-group-text">
          <IoIosSearch />
          </span>
          <input
            type="search"
            className="form-control"
            placeholder="Search..."
          />
        </div>

        <select defaultValue='1' className="form-select form-select-sm w-auto" aria-label="Small select example">
          <option value='1'>Tag</option>
          <option value="2">One</option>
          <option value="3">Two</option>
          <option value="4">Three</option>
        </select>

        <select defaultValue='1' className="form-select form-select-sm w-auto" aria-label="Small select example">
          <option value='1'>Category</option>
          <option value="2">One</option>
          <option value="3">Two</option>
          <option value="4">Three</option>
        </select>

    </div>
   
    

     
      {loading ?(
          <div className='d-flex justify-content-center align-items-center py-5'>
          <DotLoader color="#0b4f0b" />
          </div>
          )        
          :recipesList.length >0 ?(
      <table className="table table-striped m-3">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Recipe Name</th>
            <th scope="col">Recipe Image</th>
            <th scope="col">Price</th>
            <th scope="col">Description</th>
            <th scope="col">Tag</th>
            <th scope="col">Category</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>

         {recipesList.map(recipe=>(
            <tr key={recipe?.id}>
            <th scope="row">{recipe?.id}</th>
            <td>{recipe?.name}</td>
            <td><img style={{height: '60px',width:'80px', objectFit:'cover', borderRadius:'6px'}} 
                src={recipe?.imagePath ?`https://upskilling-egypt.com:3006/${recipe?.imagePath}`: recipeImg}
                alt={recipe?.name}/>
             </td>
            <td>{recipe?.price}</td>
            <td>{recipe?.description}</td>
            <td>{recipe?.tag?.name}</td>
            <td>{recipe?.category.map(cat=>(
               <div key={cat?.id}>
              {cat?.name}
              </div>
            ))}</td>


            <td>
             
            {userData?.userGroup == 'SystemUser' ? 
            (favoriteRecipes.includes(recipe.id)?
              ( <FaHeart  color='red' style={{cursor:'pointer'}}/>) :
            (<FaRegHeart color="red" style={{cursor:'pointer'}} onClick={()=> handleAddfav(recipe)}/>))  :
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
                    <Link to={`/dashboard/recipe-data/${recipe.id}`} className="dropdown-item text-warning d-flex align-items-center gap-2">
                      <FaEdit /> Edit
                    </Link>
                  </li>

                  <li>
                    <button onClick={()=> handleShow(recipe)} className="dropdown-item text-danger d-flex align-items-center gap-2">
                      <FaTrash/> Delete
                    </button>
                  </li>
                </ul>
              </div>
             }
          </td>
          </tr>

          ))}
        </tbody>
      </table>
        ):(<NoData/>)}

    </>
  )
}
