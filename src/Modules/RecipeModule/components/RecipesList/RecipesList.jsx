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
import { TAGS_URLS } from '../../../../Services/END_POINTS.JS';

export default function RecipesList() {
  const {logoutUser,userData}= useContext(AuthContext);

  const [recipesList, setRecipesList] = useState([]);
  const [recipeId, setRecipeId] = useState(0);
  const [recipeName, setRecipeName] = useState('');
  const[favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [tags, setTags] = useState([]);
  const [categoriesList,setCategoriesList]= useState([]);

  const [nameValue, setNameValue] = useState("");
  const [tagValue, setTagValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");


  //state to Pagination
  const[arrayOfPages, setArrayOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');


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

  // view Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowViewModal(true);
};



  //---- get Recipes-----
  const getAllRecipes =async(pageNo,pageSize, name,tag,category)=>{
    try {
      setLoading(true);
      let response = await axiosInstance.get(RECIPES_URL.GET_RECIPES,{
        params:{
          pageSize: pageSize,
          pageNumber: pageNo,
          name: name,
          tagId:tag,
          categoryId: category,
        }, headers: {Authorization:`Bearer ${localStorage.getItem('token')}`}
      } 
    );
    console.log(response.data.data);
    setArrayOfPages(Array(response.data.totalNumberOfPages).fill().map((_,i)=> i+1));

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
      // console.log(error);
      toast.error(error)
    }
  }

  const getTags =async()=>{
    try {
      const response = await axiosInstance.get(TAGS_URLS.GET_TAGS,{
        headers:{Authorization:`Bearer ${localStorage.getItem('token')}`}
      });

      console.log(response?.data);
      setTags(response?.data);
    } catch (error) {
      console.log(error);
      
    }
  }

  //  getAllCategories
  const getAllCategories =async()=>{
    try {
      
      let response = await axios.get('https://upskilling-egypt.com:3006/api/v1/Category/',{
      headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
      params:{
        pageSize: 10,
        pageNumber: 1
      }}
      );
      console.log(response.data.data);
      setCategoriesList(response?.data?.data);
      
    } catch (error) {
      console.log(error);
    }
  }

  const getNameValue=(input)=>{
    setNameValue(input.target.value);
    setCurrentPage(1);
    getAllRecipes(1,pageSize, input.target.value,tagValue,categoryValue);

  }

  const getTagValue=(input)=>{
    // alert("tagchanged");
    setTagValue(input.target.value);
    setCurrentPage(1);
    getAllRecipes(1,pageSize,nameValue ,input.target.value,categoryValue);

  }

  const getCategoryValue=(input)=>{
    // alert("catchanged");
    setCategoryValue(input.target.value);
    setCurrentPage(1);
    getAllRecipes(1,pageSize,nameValue ,tagValue,input.target.value);

  }


  useEffect(()=>{
    getAllRecipes(currentPage, pageSize);
  },[currentPage]);

  useEffect(()=>{
    // getAllRecipes(currentPage, pageSize);
    getAllFavorites();
    getTags();
    getAllCategories();
  },[])

  const filteredRecipes = recipesList.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Header title={'Recipes Items'} description={'You can now add your items that any user can order it from the Application and you can edit'} imgUrl={headerImg1}/>
     
    <div className="recipes-container m-3 d-flex  flex-column flex-sm-row justify-content-between align-items-center p-4 rounded-3">
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


    {/* view recipe in modal */}
    <Modal
      show={showViewModal}
      onHide={() => setShowViewModal(false)}
      centered dialogClassName="small-view-modal">
      <Modal.Header  style={{
       background: 'linear-gradient(90deg, #009247, #fff)',color:"#fff"}} closeButton>
        <Modal.Title>Recipe Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {selectedRecipe && (
          <div className="shadow-sm recipes-page">
            <div className='d-flex justify-content-center mb-3'>
              <img
                src={
                  selectedRecipe.imagePath
                    ? `https://upskilling-egypt.com:3006/${selectedRecipe.imagePath}`
                    : recipeImg
                }
              
                alt={selectedRecipe.name}
                style={{ height: '80px', borderRadius:"50%",objectFit: 'cover' }}
              />
            </div>
            <div className="py-2 px-2">
              <h6 className="mb-3">
                <strong>Recipe Name:</strong> {selectedRecipe.name}
              </h6>

              <h6 className="mb-3">
                <strong>Price:</strong> {selectedRecipe.price}
              </h6>
              <h6 className="mb-3">
              <strong>Tag:</strong> {selectedRecipe.tag?.name}
              </h6>

              <h6 className="mb-3">
                <strong>Category:</strong>{' '}
                {selectedRecipe.category
                  ?.map(cat => cat.name)
                  .join(', ')}
              </h6>

              <h6 className="mb-3">
                <strong>Descripton:</strong> {selectedRecipe.description}
              </h6>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>


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

    {/* may be search individual Search by Recipe Name , Tag and Category or comparison  */}
    <div className='search-container p-4'>
      <div className='row g-3'>
        <div className='col-12 col-md-6'>
        <div className="input-group ">
          <span className="input-group-text">
          <IoIosSearch />
          </span>
          <input
            type="search"
            className="form-control" 
            placeholder="Search..."
            onChange={getNameValue}
          />
        </div>
        </div>

        <div className='col-6 col-md-3'>
          <select className="form-select" onChange={getTagValue} aria-label="Small select example">
            <option value=''  disabled selected>Tag</option>
            {tags.map(({id,name})=>(
              <option key={id} value={id}>
                {name}
                </option>

            ))}
            
          </select>
        </div>

        <div className='col-6 col-md-3'>
          <select className="form-select" onChange={getCategoryValue} aria-label="Small select example">
            <option value=''  disabled selected>Category</option>
            {categoriesList.map(({id, name})=>(
              <option key={id} value={id}>
              {name}
              </option>

            ))}
           
          </select>
        </div>
    </div>
    </div>
     
      {loading ?(
          <div className='d-flex justify-content-center align-items-center py-5'>
          <DotLoader color="#0b4f0b" />
          </div>
          )        
          :recipesList.length >0 ?(
      <div className="container-fluid px-3 my-3">
      <div className='table-resposive d-none d-lg-block'>
      <table className="table table-striped recipes-table">
        <thead className='table-secondary custom-thead'>
          <tr className='p-3'>
            <th scope="col">ID</th>
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
                    <button className="dropdown-item text-success d-flex align-items-center gap-2"
                     onClick={() => handleViewRecipe(recipe)}>
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

          {/* Show message if no recipe matches search */}
          {recipesList.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center">No recipe found</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      </div>
        ):(<NoData/>)}


        {/* ===== CARDS (Mobile) ===== */}
<div className="d-block d-lg-none my-3">
  <div className='container'>
    <div className='row g-3'>
  {recipesList.length > 0 ? (
    recipesList.map(recipe => (
      <div key={recipe.id} className='col-12 col-sm-6 col-md-4'>
      <div className="card h-100 shadow-sm">
        <img
          src={
            recipe.imagePath
              ? `https://upskilling-egypt.com:3006/${recipe.imagePath}`
              : recipeImg
          }
          className="card-img-top"
          alt={recipe.name}
          style={{ height: '180px', objectFit: 'cover' }}
        />

        <div className="card-body py-3">
          <h5 className="card-title text-center fw-bold mb-3">{recipe.name}</h5>
          <p className="mb-1 d-flex justify-content-between mx-2">
          <span><strong>Price:</strong>{recipe.price}</span>
          <span><strong>Tag:</strong> {recipe.tag?.name}</span></p>
          {/* <p className="mb-1"><strong>Tag:</strong> {recipe.tag?.name}</p> */}

          <p className="mb-2 mx-2">
            <strong>Category:</strong>{' '}
            {recipe.category.map(cat => cat.name).join(', ')}
          </p>

          <div className="d-flex justify-content-center mt-4">

          {userData?.userGroup == 'SystemUser' &&
            (favoriteRecipes.includes(recipe.id)?
              ( <FaHeart  color='red' style={{cursor:'pointer'}}/>) :
            (<FaRegHeart color="red" style={{cursor:'pointer'}} onClick={()=> handleAddfav(recipe)}/>)) }
            
          </div>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center">No recipe found</p>
  )}
  
  </div>
  </div>
</div>





{/* Pagination */}
  <nav>
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

      {/* Page Numbers */}
      {arrayOfPages.map(page => (
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

      {/* Next */}
      <li className={`page-item ${currentPage === arrayOfPages.length ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === arrayOfPages.length}
        >
          Next
        </button>
      </li>

    </ul>
  </nav>
        

    </>
  )
}
